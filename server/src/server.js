require("dotenv").config();
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const supabase = require('./services/supabaseDatabaseService');
const initializePassport = require('./passport_config');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const usersRouter = require("./routes/usersRouter");
const friendsRouter = require("./routes/friendsRouter");
const friend_requestsRouter = require("./routes/friend_requestsRouter");
const chatroomsRouter = require("./routes/chatroomsRouter");
const messagesRouter = require("./routes/messagesRouter");
const http = require('http');
const { Server } = require('socket.io');

/* SETTING UP SERVER */
initializePassport(passport);
const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:3001', 'http://localhost:3002'],
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

const secretKey = crypto.randomBytes(64).toString('hex'); // Secret key for app session

// Setting up cors and session for app
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin 
      // (like mobile apps or curl requests)
      if(!origin) return callback(null, true);
      if(['http://localhost:3001', 'http://localhost:3002'].indexOf(origin) !== -1){
         callback(null, true)
      } else {
         callback(new Error('Not allowed by CORS'))
      }
    },
    credentials: true,
  }),
  session({
    secret: secretKey,
    cookie: { maxAge: 3000000 },
    resave: false,
    saveUninitialized: false,
    sameSite: 'none',
    secure: true,
  })
);

// Adding passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


/* API ROUTES */
app.use("/api/users", usersRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/friend_requests", friend_requestsRouter);
app.use("/api/chatrooms", chatroomsRouter);
app.use("/api/messages", messagesRouter);


/* USER AUTHENTICATION */

// Login route
app.post('/api/login', (req, res, next) => {
    passport.authenticate('local', (err, user, { message }) => {
        if (err) {
          return next(err);
        }
        if (!user) {
          return res.json({ success: false, message });
        }
        req.logIn(user, (err) => {
          if (err) {
            return next(err);
          }
          // Return the user's ID in the response
          return res.json({ success: true, message, user });
        });
    })(req, res, next);
});

// Signup route
app.post('/api/signup', async (req, res) => {
  // Password will already be hashed by now
  const { username, hashedPassword, is_active } = req.body;
  const userExists = await supabase.from("users").select("*").eq("username", username);
  console.log("HASH PASSWORD FOR SIGN UP, ", hashedPassword)
  if (userExists.data.length > 0) {
    console.log("Username already exists")
    return res.status(400).json({ error: 'Username already exists' });
  }
  console.log("Username is valid")

  try {
    const response = await supabase.from("users").insert([{ username, password: hashedPassword, is_active}]);
    console.log("User successfully created and added to database");
    return res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Logout route
app.get('/api/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.json({ success: false, message: 'Error logging out' });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });
});


const messagesModel = require('./models/messagesModel');
const m_createMessage = messagesModel.m_createMessage;

/* SOCKET.IO */
io.on('connection', (socket) => {
  console.log('A user connected');

  // Join a chat room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  // Send a new message
  socket.on('send-message', async (data) => {
    const { roomId, message, senderId, chatroom_index } = data;
    // Save the message to the database
    try {
      const created_message = await m_createMessage({ chatroom_id: roomId, chatroom_index, sender_id: senderId, content: message });
      console.log("Message saved to database");
    } catch (error) {
      console.error("Error saving message to database:", error);
    }

    // Broadcast the message to everyone in the room with id = roomId
    socket.to(roomId).emit('receive-message', { message, senderId, chatroom_index });
    console.log("Message broadcast to all users in chatroom with id: ", roomId)
  });

  // Leave a chat room
  socket.on('leave-room', (roomId) => {
    socket.leave(roomId);
    console.log(`User left room ${roomId}`);
  });

  socket.on('disconnect', () => {
    console.log('A user disconnected');
  });
});


/* RUNNING SERVER */
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

module.exports = app;