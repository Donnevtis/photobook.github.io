const Albums = require('../models/album');
const Files = require('../models/files');

module.exports = function(req, res) {
    return new Promise((resolve, reject) => {
        Albums.find({ owner: req.user._id }, null, { 'sort': '-date' }, (err, albums) => {
            if (err) reject(err)
            else if (albums.length) {
                (async() => {
                    const prom = albums.map(async album => {
                        album.count = await Files.countDocuments({ album: album._id }).exec();
                        return album;
                    })
                    const prom2 = albums.map(async album => {
                        album.files = await Files.find({ album: album._id }).sort({ 'date': -1 }).limit(18).exec();
                        return album;
                    })
                    resolve(await Promise.all(prom, prom2));
                })()

            } else {
                reject(null);
            }
        });
    })
}