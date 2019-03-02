const express = require('express');
const router = express.Router();
const Finder = require('../config/findAlbums');
const app = express();
let fullname = 'dev env'



router.get('/', function(req, res) {
    if ('user' in req) {
        fullname = req.user.fullname;
    }
    if (!req.isAuthenticated() && app.get('env') === 'production') {
        res.redirect('/user/login');
    } else {
        let t = Date.now();
        Finder(req, res)
            .then(albums => {
                let count = 0;
                t = Date.now() - t;
                console.log(t);
                albums.forEach(album => {
                    count += album.count;
                });

                res.render('index', {
                    fullname: fullname,
                    albums: albums,
                    count: count
                });

            }, err => {
                if (err) req.flash('error', err || 'database do not answer');

                res.render('index', {
                    fullname: fullname
                })
            })

    }




});

module.exports = router;