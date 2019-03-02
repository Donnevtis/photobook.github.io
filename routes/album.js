const express = require('express');
const fs = require('fs');
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
                Files.find({ album: album._id })
                    .then(files => findAndDelete(files, req, album)
                        .then(col => {
                            if (files.length == col) {
                                const path = `./users/${req.user.username}/photo/${album._id}`
                                fs.rmdir(path + '/mini', err => {
                                    if (err) console.log(err);
                                    setTimeout(() => {
                                        fs.rmdir(path, err => {
                                            if (err) console.log(err);
                                        })
                                    }, 1000)
                                });
                            }
                        }))
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

async function findAndDelete(files, req, album) {

    const match = files.map(async file => {
        const match = await Files.findOne({ owner: req.user.id, hash: file.hash }).exec();
        if (match) file = null;
        return file;
    })


    let matches = await Promise.all(match)
    matches = matches.filter(item => {
        return item ? true : false;
    })

    for await (const file of matches) {
        fs.unlink('./' + file.originalpath, err => { if (err) console.log(err) })
        fs.unlink(file.miniature, err => { if (err) console.log(err) })
    }
    return matches.length;

}


module.exports = router;