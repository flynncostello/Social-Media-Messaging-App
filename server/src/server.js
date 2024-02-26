const express = require("express");
const cors = require("cors");
const logger = require("morgan");
const path = require("path");

const tasksRouter = require("./routes/tasksRouter");

const app = express();

app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, "public")));

app.use("/api/tasks", tasksRouter);

/*
const port = process.env.PORT || 5001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
*/

const port = process.env.PORT || 10000;

// Bind the server to host 0.0.0.0 and the specified port
app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on http://0.0.0.0:${port}!`);
});

module.exports = app;
