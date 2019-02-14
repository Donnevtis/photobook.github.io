'use strict';
const express = require('express');
const path = require('path');
const port = process.env.PORT || 1337;
const multer = require('multer');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');


// Files upload routes
const upload = multer({ dest: 'uploads/' });

// Init App
const app = express();

// Security setting
app.disable('x-powered-by');

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Public folder route
app.use(express.static(path.join(__dirname, 'public')));

// Express Session Middleware
let sessionStore = require('./config/store');
if (app.get('env') !== 'development') {
    console.log('dev');
    sessionStore = '';
}
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

app.get('*', function(req, res, next) {
    // console.log(req.user)
    res.locals.user = req.user || null;
    next();
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
    let fullname = 'dev env'
    if ('user' in req) {
        fullname = req.user.fullname;
    }
    if (!req.isAuthenticated() && app.get('env') === 'production') {
        res.redirect('/user/login');
    } else res.render('index', { fullname: fullname });
});

// route users
let users = require('./routes/users');
app.use('/user', users);

//redactor route
let redactor = require('./routes/redactor')
app.use('/redactor', redactor);

// Start server
app.set('port', process.env.PORT || 1337);
const listener = app.listen(port, function() {

    console.log(`Your app is listening on port ${port}`);
});