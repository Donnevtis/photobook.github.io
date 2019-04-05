const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Album Schema

let filesSchema = mongoose.Schema({
    originalname: {
        type: String,
        required: true
    },
    min: {
        type: String,
        required: true
    },
    album: {
        type: Schema.Types.ObjectId,
        ref: 'Album'
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    data: {
        date: String,
        time: String,
        aperture: String,
        exposure: String,
        iso: String
    }
});


let Files = module.exports = mongoose.model('Files', filesSchema);