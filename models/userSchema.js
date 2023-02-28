const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true}, 
    password: { type: String, required: true}, 
    name: String, 
    email: { type: String, unique: true}, 
    isAdmin: { type: Boolean, default: false},
    isLoggedIn: Boolean,
    profilePic: String,
}, { timestamps: true })

const User = mongoose.model("practiceUser", userSchema)
module.exports = User