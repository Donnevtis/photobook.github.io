'use strict';
const express = require('express');
const path = require('path');
const port = process.env.PORT || 1337;
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const config = require('./config/database');

// MongoDB connent
mongoose.set('debug', true);
mongoose.connect(config.uri, { useNewUrlParser: true })
    .then(() => {
            console.log('Database ready to use');
        },
        err => {
            console.log('database error - ' + err)
        });

// Init App
const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express Session Middleware
app.use(session({
    secret: 'keyboard cat',
    resave: true,
    saveUninitialized: true
}));

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*', function(req, res, next) {
    res.locals.user = req.user || null;
    next();
    console.log(req.user);

})

// Bring in Models
let Album = require('./models/album');

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// New album route
app.post('/create', function(req, res) {
    console.log(req.body.title);
});

// Load files route
app.post('/photos/upload', upload.array('file', 12), function(req, res, next) {
    console.log(req.files);
    res.send('200');
});

// Home route
app.get('/', function(req, res) {
    res.render('index');
});

// Public folder route
app.use(express.static(path.join(__dirname, 'public')));

// route users
let users = require('./ruotes/users');
app.use('/user', users);

// Start server

app.set('port', process.env.PORT || 1337);
const listener = app.listen(port, function() {
    console.log(`Your app is listening on port ${port}`);
});