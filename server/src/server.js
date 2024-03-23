require("dotenv").config();

const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");

const usersRouter = require("./routes/usersRouter");
const friendsRouter = require("./routes/friendsRouter");
const friend_requestsRouter = require("./routes/friend_requestsRouter");
const chatroomsRouter = require("./routes/chatroomsRouter");
const messagesRouter = require("./routes/messagesRouter");


const app = express();

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


const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

module.exports = app;

/*
http://localhost:3000
*/
