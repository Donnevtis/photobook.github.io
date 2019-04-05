const express = require('express');
const router = express.Router();
const gridFS = require('../middleware/gridFS');

router.get('*', (req, res) => {
    const id = req.originalUrl.split('/')[3];

    const stream = gridFS.download(id)
        .pipe(res);

    stream.on('data', function(data) {
        res.write(data);
    });

    stream.on('end', function() {
        res.end();
    });


})

module.exports = router;