const mongoose = require('mongoose'),
    Schema = mongoose.Schema
    // Album Schema

let albumSchema = mongoose.Schema({
    date: {
        type: Date,
        default: Date.now
    },
    title: {
        type: String,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    visible: {
        type: Boolean,
        require: true
    },
    files: Array
});


module.exports = mongoose.model('Album', albumSchema)