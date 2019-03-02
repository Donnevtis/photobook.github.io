const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

// Album Schema

let filesSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    originalname: {
        type: String,
        required: true
    },
    album: {
        type: Schema.Types.ObjectId,
        ref: 'Album'
    },
    owner: {
        type: String,
        required: true
    },
    data: {
        date: String,
        time: String,
        aperture: String,
        exposure: String,
        iso: String
    },
    originalpath: {
        type: String,
        required: true
    },
    miniature: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true

    }

});


let Files = module.exports = mongoose.model('Files', filesSchema);