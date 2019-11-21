const express = require('express');
const mkdirp = require('mkdirp');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
const Album = require('../models/album');
const Finder = require('../middleware/findAlbums');
const gridFS = require('../middleware/gridFS');
const Files = require('../models/files');
let avatar;

// Multer settings
// const storage = multer.diskStorage({
//         destination: (req, file, cb) => {
//             const path = `./users/${req.user.username}/photo/avatar`;
//             mkdirp.sync(path);
//             cb(null, path)
//         },
//         filename: (req, file, cb) => {
//             cb(null, file.originalname)
//         }
// })
const storage = multer.memoryStorage();

function fileFilter(req, file, cb) {
    const fileTypes = /jpeg|jpg/;
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
    limits: { fileSize: 3E7 }
}).single('file');


// Show avatar redactor
router.get('/', (req, res) => {
    Finder(req, res, false)
        .then(album => {
                res.render('redactor', { avatar: album[0].files });
            },
            err => {
                new Album({
                        title: 'Avatar',
                        owner: req.user._id,
                        visible: false
                    })
                    .save((err, product) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send(err);
                        } else {
                            User.findOneAndUpdate({ _id: req.user._id }, { avatarAlbum: product._id }, { upsert: true });
                        }
                    })



                res.render('redactor', { avatar: [] });
            })

})

//Send picture
.post('/upload', function(req, res) {

    upload(req, res, async err => {
        if (err) {
            console.log(err);
            res.status(300).send(err);
        } else {
            const id = await sendAvatar(req.file);
            res.render('redactor', { avatar: [{ _id: id }], user: req.user });
            avatar = req.file.buffer;
        };

    })

    async function sendAvatar(file) {
        let metadata = new Files({
            album: req.user.avatarAlbum,
            originalname: file.originalname,
            owner: req.user._id,
            min: true
        });

        try {
            id = await gridFS.send(file.originalname, file.buffer, metadata)
        } catch (error) {
            console.log(error);
            res.sendStatus(500)
        }
        return id;
    }

})

// Save settings
.post('/save', (req, res) => {
    let coords = req.body;
    for (let key in coords) {
        coords[key] = Math.floor(coords[key]);
    }
    sharp(avatar)
        .extract({ left: coords.left, top: coords.top, width: coords.width, height: coords.width })
        .resize(80)
        .toBuffer()
        .then(pic => User.findOneAndUpdate({ _id: req.user._id }, { pic: pic }, { upsert: true }, () => res.sendStatus(201)))
        .catch(err => console.log(err))
})

.get(`/avatar/*`, (req, res) => {
    res.send(req.user.pic);
})
module.exports = router;