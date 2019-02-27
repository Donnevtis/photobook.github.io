const express = require('express');
const router = express.Router();
const Albums = require('../models/album');
const Files = require('../models/files');
const Finder = require('../config/findAlbums');

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
    .delete('/remove/*', (req, res) => {
        const title = req.url.substring(8).replace('%20', ' ');
        Albums.findOneAndDelete({ title: title })
            .then(album => {
                    Files.deleteMany({ album: album._id || null })
                },
                err => {
                    console.log(err);
                })
            .then(() => {
                Finder(req, res)
                    .then(albums => {
                        let count = 0;
                        albums.forEach(album => {
                            count += album.count;
                        });

                        res.render('album', {
                            albums: albums
                        });

                    })
            })

    })

module.exports = router;