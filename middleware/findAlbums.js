const Albums = require('../models/album');
const gridFS = require('../middleware/gridFS');


module.exports = function(req, res, visible) {
    return new Promise((resolve, reject) => {
        Albums.find({ owner: req.user._id, visible: visible }, null, { 'sort': '-date' }, (err, albums) => {

            if (err) reject(err)
            else if (albums.length) {
                (async() => {

                    const prom = albums.map(async album => {
                        const grid = new gridFS;
                        const cursor = await grid.getCursor(album);
                        album.files = await cursor.toArray();
                        album.count = await cursor.count();
                        return album;
                    })

                    resolve(await Promise.all(prom));

                })()

            } else {
                reject(null);
            }
        });
    })
}