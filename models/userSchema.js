const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: { type: String, required: true }, 
    password: { type: String, required: true}, 
    name: String, 
    email: String, 
    isAdmin: { type: Boolean, default: false},
    isLoggedIn: Boolean,
    profilePic: String,
}, { timestamps: true })

const User = mongoose.model("practiceUser", userSchema)
module.exports = User