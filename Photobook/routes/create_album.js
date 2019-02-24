const express = require('express');
const router = express.Router();
let Album = require('../models/album');

router.post('/', (req, res) => {
    let title = req.body.title;
    let newAlbum = new Album({
        title: title,
        owner: req.user._id
    });
    newAlbum.save(err => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else res.sendStatus(200);
    })


});

module.exports = router;