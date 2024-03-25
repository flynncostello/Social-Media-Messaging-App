require("dotenv").config();

const express = require('express');
const cors = require('cors');
const logger = require('morgan');
const path = require('path');
const passport = require('passport');
const session = require('express-session');


//const pool = require('./config/db');
const supabase = require('./services/supabaseDatabaseService');

const initializePassport = require('./passport_config');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const bcrypt = require('bcrypt');
require('dotenv').config();

const usersRouter = require("./routes/usersRouter");
const friendsRouter = require("./routes/friendsRouter");
const friend_requestsRouter = require("./routes/friend_requestsRouter");
const chatroomsRouter = require("./routes/chatroomsRouter");
const messagesRouter = require("./routes/messagesRouter");

initializePassport(passport);

const app = express();

const secretKey = crypto.randomBytes(64).toString('hex');

// Middleware
app.use(cors({
  origin: 'http://localhost:3001',
  credentials: true,
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Session middleware
app.use(
  session({
    secret: secretKey,
    cookie: { maxAge: 3000000 },
    resave: false,
    saveUninitialized: false,
    sameSite: 'none',
    secure: true,
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/users", usersRouter);
app.use("/api/friends", friendsRouter);
app.use("/api/friend_requests", friend_requestsRouter);
app.use("/api/chatrooms", chatroomsRouter);
app.use("/api/messages", messagesRouter);


// Login route
app.post('/api/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ success: false, message: 'authentication failed' });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Return the user's ID in the response
      return res.json({ success: true, message: 'Logged in successfully', userId: user.user_id });
    });
  })(req, res, next);
});

// Signup route
app.post('/api/signup', async (req, res) => {
  const { username, password } = req.body;
  const userExists = await supabase.from("users").select("*").eq("username", username);

  if (userExists.rows.length > 0) {
    return res.status(400).json({ error: 'Username already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  try {
    await supabase.from("users").insert([{ username, password: hashedPassword }]);
    // Generate a token or send a success message
    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Logout route
app.get('/api/logout', (req, res) => {
  req.logout();
  res.json({ success: true, message: 'Logged out successfully' });
});

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

module.exports = app;

/*
http://localhost:3000
*/

