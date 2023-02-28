
const mongoose = require("mongoose");
require('dotenv').config();
//for server
const express = require("express");
//for secruity cross origin
const cors = require("cors");
//entire authentication library
const passport = require("passport");
//using this as a strategy
const passportLocal = require("passport-local").Strategy;
//to parse all of the cookies we use for authentication
const cookieParser = require("cookie-parser");
//for hashing that passwords
const bcrypt = require("bcryptjs");
const session = require("express-session");
//parse the request and response objects
const bodyParser = require("body-parser");
//environmental variables
const app = express();
const mongoURI = process.env.MONGO_URI
//models
const User = require('./models/userSchema')

mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, console.log('Mongoose is connected')
)
//Middleware
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

app.use(
    cors({
        //nothing will work if this isnt there
        //origin should be the location of the react app we are connecting it to
        origin: "http://localhost:3000",
        credentials: true,
    })
)
app.use(
    session({
      secret: "secretcode",
      resave: true,
      saveUninitialized: true,
    })
  );
//for the cookie parser you want to use the same secret that you have in session
app.use(cookieParser("secretcode"))

//ROUTES
app.get('/', (req,res) => {
    res.send('This is my practice backend')
})
app.post('/login', (req,res) => {
    console.log(req.body)
})
app.post('/register', (req,res) => {
    console.log(req.body)
})
app.post('/login', (req,res) => {
    console.log(req.body)
})
app.get('/user', (req,res) => {
})
//Start Server
app.listen(3001, function () {
    console.log("Server Has Started");
  });