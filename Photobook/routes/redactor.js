const express = require('express');
const mkdirp = require('mkdirp');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const User = require('../models/user');
let avatar = '/photo/avatar/shvejtsariya.jpg';

//Multer settings
const storage = multer.diskStorage({
        destination: (req, file, cb) => {
            const path = `./users/${req.user.username}/photo/avatar`;
            mkdirp.sync(path);
            cb(null, path)
        },
        filename: (req, file, cb) => {
            cb(null, file.originalname)
        }
    })
    // const storage = multer.memoryStorage();

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
    limits: { fileSize: 3E7 }
}).single('file');


// Show avatar redactor
router.get('/', (req, res) => {
    avatar = req.user.avatar || avatar;
    res.render('redactor', { avatar: avatar })
})

//Get picture
.post('/upload', function(req, res) {
    upload(req, res, err => {
        if (err) {
            console.log(err);
            res.status(300).send(err);
        } else {
            avatar = `/users/${req.user.username}/photo/avatar/${req.file.originalname}`;
            res.render('redactor', { avatar: avatar });
        };

    })

})

// Save settings
.post('/save', (req, res) => {
    let coords = req.body;
    for (let key in coords) {
        coords[key] = Math.floor(coords[key]);
    }
    sharp('.' + avatar)
        .extract({ left: coords.left, top: coords.top, width: coords.width, height: coords.width })
        .resize(80)
        .toBuffer()
        .then(pic => User.findOneAndUpdate({ _id: req.user._id }, { pic: pic, avatar: avatar }, { upsert: true }, () => res.sendStatus(201)))
        .catch(err => console.log(err))
})

.get(`/avatar/*`, (req, res) => {
    res.send(req.user.pic);
})
module.exports = router;