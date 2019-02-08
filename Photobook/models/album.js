const mongoose = require('mongoose');

// Album Schema

let albumSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    user: {
        type: String,
        required: true
    },
    file: {
        type: Array,
        required: true
    }
});


let Album = module.exports = mongoose.model('Album', albumSchema)