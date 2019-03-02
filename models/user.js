const mongoose = require('mongoose');

//User Schema
let userSchema = mongoose.Schema({

    fullname: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: String,
    pic: Buffer

});

let User = module.exports = mongoose.model('User', userSchema);