const express = require('express');
const fs = require('fs');
const router = express.Router();
const Albums = require('../models/album');
const Files = require('../models/files');
const Finder = require('../middleware/findAlbums');

router.get('/*', (req, res) => {
        const _id = req.url.substring(1);
        Albums.findOne({ _id: _id })
            .then(album => getFiles(album))
            .then(album => {
                res.render('photos', {
                    album: album
                })
            })

        async function getFiles(album) {
            const count = Files.countDocuments({ album: album._id });
            album.files = await Files.find({ album: album._id }).skip(18).sort({ 'date': -1 }).exec();

            return album;
        }
    })
    .post('/', (req, res) => {
        const mail = req.body;
        Albums.findByIdAndUpdate(mail.album, { title: mail.newName })
            .then(() => res.end(),
                err => res.status(400).send(err)
            );
    })

.delete('/', (req, res) => {
    Albums.findByIdAndDelete(req.body.id)
        .then(album => {
                return Files.deleteMany({ album: album._id })
            },
            err => {
                res.status(400).send(err)
            })
        .then(e => {
                res.send(e.n.toString()).end();
            },
            err => {
                console.log(err);
                res.status(400).send(err)
            })
})


module.exports = router;