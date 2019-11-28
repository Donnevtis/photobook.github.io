const express = require('express');
const router = express.Router();
const Finder = require('../middleware/findAlbums');
const path = require('path')
const fs = require('fs')


router.get('/', function(req, res) {
    const script = '/js/' + fs.readdirSync(path.resolve(__dirname, '../public/js')).find(fileName => fileName.match(/script/));
    const css = '/css/' + fs.readdirSync(path.resolve(__dirname, '../public/css')).find(fileName => fileName.match(/style/));



    if ('user' in req) {
        fullname = req.user.fullname;
    }
    if (!req.isAuthenticated()) {
        res.redirect('/user/login');
    } else {
        let t = Date.now();
        Finder(req, res, true)
            .then(albums => {

                let count = 0;
                t = Date.now() - t;
                console.log('time to download files = ' + t + 'ms');
                albums.forEach(album => {
                    count += album.count;
                });



                res.render('index', {
                    fullname,
                    albums,
                    count,
                    script,
                    css
                });

            }, err => {
                if (err) req.flash('error', err || 'database do not answer');

                res.render('index', {
                    fullname,
                    script,
                    css
                })
            })


    }




});

module.exports = router;