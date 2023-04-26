require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const path = require('path');
const connectDB = require('./config/dbConn');
const cors = require('cors');
const PORT = process.env.PORT || 3500;

// connect to mongoDB
connectDB();

// use cors
app.use(cors());

// use express 
app.use(express.json());

// use encodedurl
app.use(express.urlencoded({extended: false}));

// set index to main css page
app.use("/", express.static(path.join(__dirname, "/css")));
app.use("/", require("./routes/main"));
app.use("/states", require("./routes/api/routes"));

// catch all
app.use((req, res, next) => {
  res.status(404);
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "views", "404.html"));
  } else if (req.accepts("json")) {
    res.json({ error: "404 Not Found" });
  } else {
    res.type("txt").send("404 Not Found");
  }
});

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

