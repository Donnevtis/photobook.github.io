const Albums = require('../models/album');
const Files = require('../models/files');
const db = require('../middleware/gridFS').db;
const fs = require('fs');
const mongodb = require('mongodb');
const config = require('../config/database');
const assert = require('assert');
const gridFS = require('../middleware/gridFS');


module.exports = function(req, res) {
    return new Promise((resolve, reject) => {
        Albums.find({ owner: req.user._id }, null, { 'sort': '-date' }, (err, albums) => {
            if (err) reject(err)
            else if (albums.length) {
                (async() => {
                    const prom = albums.map(async album => {
                        album.count = await gridFS.findFiles(album).count()
                        return album;
                    })
                    const prom2 = albums.map(async album => {
                        album.files = await gridFS.findFiles(album).toArray();
                        return album;
                    })
                    resolve(await Promise.all(prom2));
                    // gridFS.closeConnect()
                })()

            } else {
                reject(null);
            }
        });
    })
}