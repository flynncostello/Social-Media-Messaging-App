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

const friendsModel = require('./models/friendsModel');
const usersModel = require('./models/usersModel');

const getAllFriends = async (userId) => {
  try {
    // Get an array of friend objects for the given user
    const friendObjects = await friendsModel.m_getUsersFriends(userId);

    const friends = [];

    // Loop through each friend object and get the user information
    for (const friendObject of friendObjects) {
      const friendId = friendObject.friend_id;
      const friend = await usersModel.m_getUserById(friendId);
      friends.push(friend);
    }

    return friends;
  } catch (error) {
    console.error('Error fetching friends:', error);
    throw error;
  }
};

/* SOCKET.IO */
io.on('connection', (socket) => {
  console.log('A user connected');

  // Helper to get socket id
  socket.on('getSocketId', () => {
    socket.emit('sendSocketId', { socket_id: socket.id });
  });

  // Join a chat room
  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    console.log(`User joined room ${roomId}`);
  });

  // Update public key
  socket.on('changePublicKey', async ({ userId, publicKey }) => {
    const friends = await getAllFriends(userId);
    console.log("Changing public key and telling all my friends, ", friends);

    friends.forEach(friend => {
      const friendSocketId = friend.socket_id;
      if (friendSocketId) {
        console.log("Sending updated public key to friend with socket_id: ", friendSocketId)
        io.to(friendSocketId).emit('updatePublicKey', { publicKey });
      }
    });
  });

  // Send a new message
  socket.on('send-message', async (data) => {
    const { roomId, encrypted_message, senderId, chatroom_index } = data;
    const socketsInRoom = await io.in(roomId).fetchSockets();
    const num_users_in_room = socketsInRoom.length;
    console.log(`IN SERVER: Room ${roomId} has ${num_users_in_room} users`);
    //console.log("IN SERVER: Encrypted message: ", encrypted_message);

    if (num_users_in_room === 2) { // Both users in room
      //console.log(`Sending the following information, encrypted message: ${encrypted_message}, senderId: ${senderId}, chatroom_index: ${chatroom_index} to room with id: ${roomId}`);
      console.log("IN SERVER: Message being sent with chatroom_index: ", chatroom_index)
      socket.to(roomId).emit('receive-message', { encrypted_message, senderId, chatroom_index });
      console.log("IN SERVER: Message broadcast over socket in room with id: ", roomId);
    } else {
      console.log("IN SERVER: Other user is not in room to receive message so sending to database");
      // Store encrypted message in database
      try {
        // Send with waiting_for_retrieval porperty as true, once friend receives this message delete it as it isn't encrypted with the friend's password
        await m_createMessage({ chatroom_id: roomId, chatroom_index, sender_id: senderId, content: encrypted_message, waiting_for_retrieval: true}); // stored_by_id = -1, means no one is storing this until it is successfully retrieved next time friend opens chatroom
        console.log("IN SERVER: Encrypted message saved to database with waiting_for_retrieval as true");
      } catch (error) {
        console.error("Error saving message to database:", error);
      }
    }
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