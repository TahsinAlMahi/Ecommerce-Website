const mongoose = require('mongoose')
require('../db/mongoose')
const bcrypt = require('bcryptjs')

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    admin: {
        type: Number
    }
    
}).pre('save', async function(next) {
    const user = this
    user.password = await bcrypt.hash(user.password, 8)
    next()
})

const User = mongoose.model('User', userSchema, 'users')

module.exports = User