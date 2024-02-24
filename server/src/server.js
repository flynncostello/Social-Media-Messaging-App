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

const port = process.env.PORT || 10000; // Default to port 3000 if PORT is not defined

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;
