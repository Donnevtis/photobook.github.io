const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

// Bring in User Model
let User = require('../models/user');



//Register Form
router.get('/', function(req, res) {
    res.render('reg');
});

// Register Process
router.post('/', function(req, res) {
    const name = req.body.Username;
    const email = req.body.email;
    const password = req.body.password;
    const password2 = req.body.password2;

    if (password !== password2) {
        res.render('reg', {
            password: 'wrong'
        })
    } else {
        let newUser = new User({
            username: name,
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
                        res.redirect('signup/login');
                    }
                })
            });
        })

    }
});
// Login form
router.get('/login', function(req, res) {
    res.render('login');
})

// Login process
router.post('/login', function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/user/login'
    })(req, res, next);
})

// Logout   
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/user/login')
});

module.exports = router;