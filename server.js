
const mongoose = require("mongoose");
require('dotenv').config();
const express = require("express"); //for server
const cors = require("cors"); //for secruity cross origin
const passport = require("passport"); //entire authentication library
const passportLocal = require("passport-local").Strategy; //using this as a strategy
const cookieParser = require("cookie-parser"); //to parse all of the cookies we use for authentication
const bcrypt = require("bcryptjs"); //for hashing that passwords
const session = require("express-session");
const bodyParser = require("body-parser"); //parse the request and response objects
//environmental variables
const app = express();
const mongoURI = process.env.MONGO_URI
//models
const User = require('./models/userSchema')
//---------------END OF IMPORTS ------------------------------

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
        //origin should be the location of the react app we are connecting it to but you can white list it using *
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
//initialize passport and session
app.use(passport.initialize())
app.use(passport.session())
require('./controllers/passportConfig')(passport) //how to pass the same instance of passport for all things
//---------------END OF MIDDLEWARE ------------------------------
//ROUTES
app.get('/', (req,res) => {
    res.send('This is my practice backend')
})
app.post('/login', (req,res) => {
    console.log(req.body)
})
app.post('/register', (req,res) => {
    //test to see if the username already exists
    User.findOne({ username: req.body.username })
    //need to use then because some mongoose functions no longer accept callback functions
    .then(async (err,doc) => {
        if(err) throw err
        //if there is a document means that there is already someone registered in the database with the same document
        if(!doc){
            const hashedPassword = await bcrypt.hash(req.body.password, 10)

            const newUser = new User({
                username: req.body.username,
                password: hashedPassword,
                email: req.body.username
            });
            await newUser.save()
            res.send('User Created')
        }
    }).catch((doc) => {
        res.send('There is already an account associated with that username')
    })
})
app.post('/login', (req, res, next) => {
   passport.authenticate("local", (err, user, info) =>{
    if(err) throw err
    if(!user) res.send('No User Exists')
    else{
        req.logIn(user, err => {
            if(err) throw err;
            res.send('Successfully Authenticated')
            console.log(req.user)
        })
    }
   })(req, res, next)
})
app.get('/user', (req,res) => {
    res.send(req.user) // stores the entire user that has been authenticated inside of it
})

//Start Server
app.listen(3001, function () {
    console.log("Server Has Started");
  });