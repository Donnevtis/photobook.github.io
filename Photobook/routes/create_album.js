const express = require('express');
const router = express.Router();
let Album = require('../models/album');

router.post('/', (req, res) => {
    let title = req.body.title;
    let newAlbum = new Album({
        title: title,
        owner: req.user._id
    });
    newAlbum.save((err, product) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else {
            console.log(product._id)
            res.json(product._id);
        }
    })


});

module.exports = router;