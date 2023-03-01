//all of the configuration for passport to authenticate a user
const User = require('../models/userSchema')
const bcrypt = require('bcryptjs') // need this to unhash passwords
const localStrategy = require('passport-local').Strategy

module.exports = function(passport) { //psassing in pasport to use the same instance through entire application

    passport.use(
        //done a call back function that says we are done lets continue
        //username and passward come from req.body
        new localStrategy((username, password, done) => {
            User.findOne({username: username}) // look up the user in the db
            .then( (err, user) => { //if successful we will get a user or an error
                if (err) throw err
                if (!user) return done(null, false) // if there is no user we want to return the done method with no error and no user
                bcrypt.compare(password, user.password, (err, result) =>{ // will either get an error or a result
                    if (err) throw err
                    if (result === true){
                        return done(null, user)
                    }else{
                        return done(null,false) // means that the comparison failed aka the password was not the same
                    }

                })
            })
        })
    )
    passport.serializeUser((user,cb) => { //stores a cookie in the browser with user id
        cb(null, user.id)
    })
    passport.deserializeUser((id, cb) => { //takes the cookie and unravels it
        User.findOne({_id: id})
        .then((err, user) => {
            cb(err, user)
        })
    })
}