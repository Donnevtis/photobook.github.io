const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Albums = require('../models/album');
const Files = require('../models/files');
const app = express();
let fullname = 'dev env'


router.get('/', function(req, res) {
    if ('user' in req) {
        fullname = req.user.fullname;
    }
    if (!req.isAuthenticated() && app.get('env') === 'production') {
        res.redirect('/user/login');
    } else {

        Albums.find({ owner: req.user._id }, null, { 'sort': '-date' }, (err, albums) => {
            if (err) console.log(err)
            else if (albums.length) {
                let count;
                async function getAlbums(albums) {
                    count = await Files.countDocuments({ owner: req.user._id });
                    for (var album of albums) {
                        album.count = await Files.countDocuments({ album: album._id });
                        album.files = await Files.find({ album: album._id }).sort({ 'date': -1 }).limit(18)
                    }
                    Promise.all(album.files, album.count);
                }

                getAlbums(albums)
                    .then(() => {
                        res.render('index', {
                            fullname: fullname,
                            albums: albums,
                            count: count,
                        });

                    })
                    // setTimeout(() => console.log(albums[0].fil), 2000);
            } else res.render('index', {
                fullname: fullname

            });


        })

    }




});

module.exports = router;