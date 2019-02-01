'use strict';
const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
})


const listener = app.listen(1337, function () {
    console.log('Your app is listening on port ' + listener.address() + '1337');
});

