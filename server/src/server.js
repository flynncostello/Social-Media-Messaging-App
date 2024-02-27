const express = require("express");
const cors = require("cors");
const logger = require("morgan");
//const path = require("path");

const tasksRouter = require("./routes/tasksRouter");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(express.static(path.join(__dirname, "public")));

// app.use("https://full-stack-to-do-list-app.onrender.com/api/tasks", tasksRouter);
app.use("/api/tasks", tasksRouter);


/*
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'index.html'));
});
*/


//const host = process.env.HOST || '0.0.0.0';
const port = process.env.PORT || 10000;

// Increase server.keepAliveTimeout and server.headersTimeout
const server = app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});

// Set server.keepAliveTimeout and server.headersTimeout to 300 seconds (5 minutes)
//server.keepAliveTimeout = 300000; // 300 seconds
//server.headersTimeout = 300000;  // 300 seconds

module.exports = app;
