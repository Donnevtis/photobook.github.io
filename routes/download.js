const express = require('express');
const router = express.Router();
const gridFS = require('../middleware/gridFS');

router.get('*', async(req, res) => {
    const id = req.originalUrl.split('/')[3];
    const grid = new gridFS;

    const stream = await grid.download(id);
    stream.pipe(res).on('readable', function(data) {
        res.write(data);
    }).on('end', function() {
        res.end();
    });




})

module.exports = router;