const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const fs = require('fs');
const path = require('path')
    // Bring in User Model
let User = require('../models/user');

const script = '/js/' + fs.readdirSync(path.resolve(__dirname, '../public/js')).find(fileName => fileName.match(/regs/));
const css = '/css/' + fs.readdirSync(path.resolve(__dirname, '../public/css')).find(fileName => fileName.match(/stylereg/));

//Register Form
router.get('/', function(req, res, next) {
    res.render('reg', {
        script,
        css
    });
});

// Register Process
router.post('/', function(req, res, next) {
    const fullname = req.body.fullname;
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;
    const queryEmail = { email: email };
    const queryUser = { username: username };
    const resFrom = {
        fullname: fullname,
        username: username,
        email: email
    }
    User.findOne(queryUser, (err, data) => {
        if (err) throw err;
        if (data) {
            req.flash('error', 'Username already taken');
            res.render('reg', resFrom);
        } else {
            User.findOne(queryEmail, (err, data) => {
                if (err) throw err;
                if (data) {
                    req.flash('error', 'Email already taken');
                    res.render('reg', resFrom);
                } else createAccount();
            });
        }
    });

    function createAccount() {
        if (password !== password2) {
            req.flash('error', 'Passwords do not match');
            res.render('reg', resFrom);
        } else {
            let newUser = new User({
                fullname: fullname,
                username: username,
                email: email,
                password: password
            });
            bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    if (err) {
                        console.log(err);
                    }

                    newUser.password = hash;
                    newUser.save(function(err) {
                        if (err) {
                            console.log(err)
                        } else {
                            auth(req, res, next);
                        }
                    })
                });
            })
        }
    }
});

// Login form
router.get('/login', function(req, res) {
    res.render('login', {
        script: '',
        css
    });
})

// Login process
router.post('/login', (req, res, next) => auth(req, res, next))

// Logout   
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/user/login')
})

// Authenticate function
function auth(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login',
        failureFlash: true
    })(req, res, next);
}

module.exports = router;