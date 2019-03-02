'use strict';
const express = require('express');
const path = require('path');
const port = process.env.PORT || 1337;
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');

// Init App
const app = express();

// Security setting
app.disable('x-powered-by');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Express Session Middleware
let sessionStore = require('./config/store');
// if (app.get('env') !== 'development') {
//     console.log('dev');
//     sessionStore = '';
// }
app.use(session({
    secret: 'keyboard cat',
    key: "sid",
    cookie: {
        httpOnly: true,
        maxAge: null
    },
    resave: false,
    saveUninitialized: true,
    store: sessionStore
}));

// Messages
app.use(require('connect-flash')());
app.use(function(req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    next();
});

// Passport config
require('./config/passport')(passport);
// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Load View Engine
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// Routes
// Public folder route
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function(req, res, next) {
    // console.log(req.user)
    res.locals.user = req.user || null;
    next();
})

// Home route
let main = require('./routes/main');
app.use('/', main);

// Route users
let users = require('./routes/users');
app.use('/user', users);

// New album route
const createAlbum = require('./routes/create_album');
app.use('/create', createAlbum);

// Upload files route
let uploads = require('./routes/upload_files');
app.use('/upload', uploads);

//Download files route
app.get('/users/*', (req, res, next) => {
    let user = req.originalUrl.split('/')[2];
    if (!req.isAuthenticated() && app.get('env') === 'production') {
        res.redirect('/user/login');
    } else if (user != req.user.username) {
        res.end('bad request');
    } else next();

})
app.use('/users', express.static(path.join(__dirname, 'users')));

// Open album route
let album = require('./routes/album');
app.use('/album', album);

// Redactor route
let redactor = require('./routes/redactor')
app.use('/redactor', redactor);

// Start server
app.set('port', process.env.PORT || 1337);
const listener = app.listen(port, function() {

    console.log(`Your app is listening on port ${port}`);
});