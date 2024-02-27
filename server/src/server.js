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

//app.use("https://full-stack-to-do-list-app.onrender.com/api/tasks", tasksRouter);

app.use("/api/tasks", tasksRouter);

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'client', 'public', 'index.html'));
});


const port = process.env.PORT || 10000;

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});


module.exports = app;
