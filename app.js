// Imports
const morgan = require('morgan');
const path = require('path');
const nocache = require('nocache');
const helmet = require('helmet');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const uuid = require('node-uuid');
const fs = require('fs');

//App Routes 
const userRoutes = require("./routes/user.routes");
const postRoutes = require("./routes/post.routes");


morgan.token('id', function (req,res) {
  return (
    req.headers.id, req.id)
});

// Initialize express App
const app = express();

function assignId (req, res, next) {
  req.id = uuid.v4()
  next()
}

app.use(assignId);
app.use(morgan(':id :method :url :response-time :remote-user'));


//CORS Control Headers 
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ORIGIN);
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  next();
});


//Express Parser Middleware 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// log only 4xx and 5xx responses to console
app.use(morgan('dev', {
  skip: function (req, res) { return res.statusCode < 400 }
}))

// log all requests to access.log
app.use(morgan('common', {
  stream: fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
}))

//auth.initialization(app);
app.use(helmet());
app.use(nocache());


//Access Routes 
// app.use("/profile", profileRoutes);
app.use("/auth", userRoutes);
app.use("/posts", postRoutes);
app.use("/img", express.static(path.join(__dirname, "img")));

module.exports = app;
