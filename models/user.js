const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nId: {
        type: String,
        required: true
    },
    username: {
        type: String,
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        required: true,
        default: false
    },
    token: {
        type: String,
    },
})

module.exports = mongoose.model('User', userSchema)