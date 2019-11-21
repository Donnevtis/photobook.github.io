const mongoose = require('mongoose');
Schema = mongoose.Schema

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
    avatarAlbum: {
        type: Schema.Types.ObjectId,
        ref: 'Album'
    },
    pic: {
        type: Buffer
    }

});

let User = module.exports = mongoose.model('User', userSchema);