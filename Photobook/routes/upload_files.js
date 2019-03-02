const express = require('express');
const mkdirp = require('mkdirp')
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');

const exif = require("jpeg-exif");
const Files = require('../models/files');
const Album = require('../models/album');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');

// Multer settings
let storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const path = `./users/${req.user.username}/photo/${req.body.id}/`;
            mkdirp.sync(path);
            cb(null, path)
        },
        filename: function(req, file, cb) {
            cb(null, Date.now() + path.extname(file.originalname));
        }
    })
    // storage = multer.memoryStorage();

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

    upload(req, res, err => {
        if (err) console.log(err)
        else {

            Album.findOne({ owner: req.user._id, _id: req.body.id })
                .then(album => getFiles(album, req.files, req)
                    .then(files => {
                        res.render('cell', { files: files })
                    })
                )
        }
    })

    async function getFiles(album, files, req) {
        const stack = [];
        const fullpath = `./users/${req.user.username}/photo/${req.body.id}/mini/`;
        mkdirp(fullpath, err => {
            if (err) {
                console.log(err);
            }
        });
        for (let file of files) {
            let path = null;
            let miniature = null;
            let data = null;
            const hash = await checkSum(file.path);


            const match = await Files.findOne({ hash: hash, owner: req.user.id });

            if (match) {
                path = match.originalpath;
                miniature = match.miniature;
                data = match.data;
                fs.unlink('./' + file.path, err => {
                    if (err) {
                        console.log(err);
                        return;
                    }
                })
            } else {
                sharp.cache(false);
                const image = sharp('./' + file.path);
                await image
                    .metadata()
                    .then(meta => {
                        if (meta.width < 700) {
                            path = miniature = './' + file.path;
                            return null;
                        } else {
                            image
                                .resize({ width: 700 })
                                .flatten(true)
                                .toFile(fullpath + file.filename)
                                .then(null, err => console.log(err));
                            miniature = fullpath + file.filename;
                            path = file.path;
                        }
                    });

            }

            newFile = await compileModel(file, album, path, miniature, hash, data);
            if (!newFile) return;
            stack.push(newFile);
        }
        return (stack);
    }

    function checkSum(path) {
        return new Promise((resolve, reject) => {
            fs.createReadStream(path)
                .on('error', reject)
                .pipe(crypto.createHash('sha1').setEncoding('hex'))
                .once('finish', function() {
                    resolve(this.read());
                })
        })
    }

    async function compileModel(file, album, path, miniature, hash, datas) {
        album = album._id;
        let originalname = file.originalname;
        let owner = req.user._id;
        let data = datas || getData(file);
        let newFile = new Files({
            album: album,
            originalname: originalname,
            owner: owner,
            data: data,
            originalpath: path,
            miniature: miniature,
            hash: hash
        });
        try {
            newFile.save()
        } catch (error) {

            res.sendStatus(500)
            newFile = null;
        }
        return newFile;
    }


    function getData(file) {
        let values = {};
        let data = exif.parseSync('./' + file.path);
        let e = data.SubExif;

        if (!e) return {};
        if (e.DateTimeOriginal) {
            let date = e.DateTimeOriginal.split(' ');
            values.date = date[0].split(':').join('.');
            values.time = date[1];
        }

        values.aperture = `F/${e.FNumber}`;
        values.exposure = `1/${1/e.ExposureTime}`;
        values.iso = `ISO ${e.PhotographicSensitivity}`;
        return values;
    }
})

module.exports = router;