require("dotenv").config();
const fs = require('fs');
const https = require('https');
const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');
const supabase = require('./services/supabaseDatabaseService');
const initializePassport = require('./passport_config');
const crypto = require('crypto');
const { Server } = require('socket.io');

const usersRouter = require("./routes/usersRouter");
const friendsRouter = require("./routes/friendsRouter");
const friend_requestsRouter = require("./routes/friend_requestsRouter");
const chatroomsRouter = require("./routes/chatroomsRouter");
const messagesRouter = require("./routes/messagesRouter");
const chatroomSharedSecretRouter = require("./routes/chatroomSharedSecretRouter");

//--------------------------------//
// SETTING UP APP, IO, and SERVER //
//--------------------------------//
initializePassport(passport);
const app = express(); // Used for middleware and routing

// Load the SSL/TLS certificate files
const keyFilePath = path.join(__dirname, 'certs/key.pem');
const certFilePath = path.join(__dirname, 'certs/cert.pem');

// Set up credential object
const credentials = {
  key: fs.readFileSync(keyFilePath, 'utf8'),
  cert: fs.readFileSync(certFilePath, 'utf8'),
};

// Create server
const server = https.createServer(credentials, app);

// Set up socket.io server to receive from ports 3000 -> 3010 for development
const io = new Server(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow connections from any localhost with ports ranging from 3000 to 3010
      if (!origin || /^https:\/\/localhost:(30[0-9][0-9]|31[0-0][0-9]|3010)$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['GET', 'POST'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  },
});

// Generate a secret key for the app session
const secretKey = crypto.randomBytes(64).toString('hex'); // Secret key for app session

// Middleware for app
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests from any localhost with ports ranging from 3000 to 3010
      if (!origin || /^https:\/\/localhost:(30[0-9][0-9]|31[0-0][0-9]|3010)$/.test(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  }),
  session({
    secret: secretKey,
    cookie: { maxAge: 3000000, secure: true, sameSite: 'none' },
    resave: false,
    saveUninitialized: false,
  })
);

// Adding passport middleware
app.use(passport.initialize());
app.use(passport.session());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


//-------------------//
// SETTING UP ROUTES //
//-------------------//
app.use("/api/users", usersRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/friend_requests", friend_requestsRouter);
app.use("/api/chatrooms", chatroomsRouter);
app.use("/api/messages", messagesRouter);
app.use("/api/chatroom_shared_secret", chatroomSharedSecretRouter);



//--------------------------------//
// SETTING UP USER AUTHENTICATION //
//--------------------------------//
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
  const { username, hashedPassword, is_active, public_key } = req.body;
  const userExists = await supabase.from("users").select("*").eq("username", username);

  if (userExists.data.length > 0) {
    console.log("Username already exists")
    return res.json({ error: 'Username already exists' });
  }

  console.log("Username is valid")

  try {
    const { data } = await supabase.from("users").insert([{ username, password: hashedPassword, is_active, public_key }]).select();
    const new_user = data[0];
    console.log("User successfully created and added to database. User data: ", new_user);
    return res.status(201).json({ success: true, message: 'User created successfully', id: new_user.id });
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
    console.log("user id: ", userId)
    console.log("Friends found: ", friendObjects)
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



//------------------------------//
// SETTING UP SOCKET.IO ROUTES //
//----------------------------//
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

  // Send a new message
  socket.on('send-message', async (data) => {
    const { roomId, encrypted_message, senderId, chatroom_index } = data;
    const socketsInRoom = await io.in(roomId).fetchSockets();
    const num_users_in_room = socketsInRoom.length;
    console.log(`IN SERVER: Room ${roomId} has ${num_users_in_room} users`);

    if (num_users_in_room === 2) { // Both users in room
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


//-----------------//
// RUNNING SERVER //
//---------------//
const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log(`Server listening on port ${port}!`);
});

module.exports = app;