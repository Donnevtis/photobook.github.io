const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const exif = require("jpeg-exif");
const Files = require('../models/files');
const Album = require('../models/album');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const gridFS = require('../middleware/gridFS');
const streamifier = require('streamifier');

// Multer settings
// let storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             const path = `./users/${req.user.username}/photo/${req.body.id}/`;
//             mkdirp.sync(path);
//             cb(null, path)
//         },
//         filename: function(req, file, cb) {
//             cb(null, Date.now() + path.extname(file.originalname));
//         }
//     })
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
    const fileTypes = /jpeg|jpg|png/;
    const extName = fileTypes.test((file.originalname).toLowerCase());
    const mimeType = fileTypes.test(file.mimetype);
    if (extName && mimeType)
        return cb(null, true)
    else
        return cb('Do not supporting type', false);

}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 16E7 }
}).array('file', 20);

router.post('/', function(req, res) {
    let t = Date.now();
    upload(req, res, err => {
        if (err) console.log(err)
        else {
            Album.findOne({ owner: req.user._id, _id: req.body.id })
                .then(album => getFiles(album, req.files, req)
                    .then(array => {
                        console.log(Date.now() - t);

                        res.render('cell', { files: array, user: req.user })
                    })
                )
        }
    })

    async function getFiles(album, files) {

        const stack = await files.map(async file => {
            let min = false;
            let minifile = null;
            sharp.cache(false);
            const image = sharp(file.buffer);
            image
                .metadata()
                .then(async meta => {
                    if (meta.width < 700) {
                        min = true;
                        return null;
                    };
                })

            if (!min) {
                minifile = await image
                    .resize({ width: 500 })
                    .flatten(true)
                    .toBuffer()
                    .then(null, err => console.log(err));
            }

            newFile = await compileModel(file, album, min, minifile);
            return newFile;
        })

        return Promise.all(stack);
    }

    function checkSum(buffer) {
        return new Promise((resolve, reject) => {
            streamifier.createReadStream(buffer)
                .on('error', reject)
                .pipe(crypto.createHash('sha1').setEncoding('hex'))
                .once('finish', function() {
                    resolve(this.read());
                })
        })
    }

    async function compileModel(file, album, min, minifile) {

        let id;
        album = album._id;
        let originalname = file.originalname;
        let owner = req.user._id;
        let data = getData(file.buffer);
        let newFileOrigin = new Files({
            album: album,
            originalname: originalname,
            min: min,
            owner: album.owner,
            data: data
        });
        let newFileMin = new Files({
            album: album,
            originalname: originalname,
            min: true,
            owner: owner,
            data: data
        });
        try {
            if (!min) {

                id = await gridFS.send(file.originalname, minifile, newFileMin)

                gridFS.send(file.originalname, file.buffer, newFileOrigin);
            } else {
                id = await gridFS.sendFile(file.originalname, file.buffer, newFileOrigin);
            }

        } catch (error) {
            console.log(error);
            res.sendStatus(500)
        }
        return [data, id];
    }


    function getData(file) {
        let values = {};
        let data = exif.fromBuffer(file);
        let e = data.SubExif;

        if (!e) return {};
        if (e.DateTimeOriginal) {
            let date = e.DateTimeOriginal.split(' ');
            values.date = date[0].split(':').join('.');
            values.time = date[1];
        }

        values.aperture = e.FNumber ? `F/${e.FNumber}` : undefined;
        values.exposure = e.ExposureTime ? `1/${1 / e.ExposureTime}` : undefined;
        values.iso = e.PhotographicSensitivity ? `ISO ${e.PhotographicSensitivity}` : undefined;
        return values;
    }
})

module.exports = router;