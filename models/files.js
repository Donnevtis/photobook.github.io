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
        date: {
            type: String,
            default: ''
        },
        time: {
            type: String,
            default: 'hh:mm:ss'
        },
        aperture: {
            type: String,
            default: 'F/'
        },
        exposure: {
            type: String,
            default: 'sec'
        },
        iso: {
            type: String,
            default: 'ISO'
        }
    }
});


let Files = module.exports = mongoose.model('Files', filesSchema);