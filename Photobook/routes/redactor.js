const express = require('express');
const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
let User = require('../models/user');
let avatar = '/photo/avatar/rustic.png';

//Multer settings
const storage = multer.diskStorage({
        destination: 'public/photo/avatar',
        filename: function(req, file, cb) {
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
    res.render('redactor', { avatar: avatar })
})

//Get picture
.post('/upload', function(req, res) {
    upload(req, res, err => {
        if (err) console.log(err)
        else {
            avatar = `/photo/avatar/${req.file.filename}`;
            res.render('redactor', { avatar: avatar })
        }
    })

})

// Save settings
.post('/save', (req, res) => {
    let coords = req.body;
    for (let key in coords) {
        coords[key] = Math.round(coords[key]);
    }
    sharp('./public/' + avatar)
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