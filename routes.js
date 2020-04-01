const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item')
const passport = require('passport');
const {
    forwardAuthenticated,
    ensureAuthenticated
} = require('./config/auth')


router.get('/', ensureAuthenticated, (req, res) => {
    res.render('index');
});

router.use('/', express.static('./static'));

router.get('/found-form', (req, res) => {
    res.render('found-form');
});

router.post('/found-form', (req, res) => {
    var status = true
    const {
        name,
        type,
        about,
        where,
        user,
        contact,
        email
    } = req.body
    let errors = []

    if (errors.length > 0) {
        res.render('found-form', {
            name,
            type,
            about,
            where,
            user,
            contact,
            email
        })
    } else {
        const newItem = new Item({
            name,
            type,
            about,
            where,
            status
        })
        newItem.save().then(user => {
            res.redirect('/found')
        })

    }
})

router.get('/lost-form', (req, res) => {
    res.render('lost-form')
})

router.post('/lost-form', (req, res) => {
    var status, completed;
    status = completed = false;
    const {
        name,
        type,
        about,
        where,
        user,
        contact,
        email
    } = req.body
    let errors = []

    if (errors.length > 0) {
        res.render('lost-form', {
            name,
            type,
            about,
            where,
            user,
            contact,
            email
        })
    } else {
        const newItem = new Item({
            name,
            about,
            type,
            where,
            status,
            completed
        })
        newItem.save().then(item => {
            res.redirect('/lost')
        })
    }
});

router.get('/lost', (req, res) => {
    res.render('lost-item');
});

router.get('/found', (req, res) => {
    res.render('found-item');
});

router.get('/register', forwardAuthenticated, (req, res) => {
    res.render('register');
});

router.post('/register', (req, res) => {
    const {
        name,
        email,
        password,
        password2
    } = req.body;
    let errors = []

    if (!name || !email || !password || !password2) {
        console.log('Please enter all fields');
    }

    if (password != password2) {
        console.log('Passwords do not match');
    }

    if (password.length < 6) {
        console.log('Password must be at least 6 characters');
    }

    if (errors.length > 0) {
        res.render('register', {
            name,
            email,
            password,
            password2
        });
    } else {
        User.findOne({
            email: email
        }).then(user => {
            if (user) {
                res.render('register', {
                    name,
                    email,
                    password,
                    password2
                });
                console.log('User is already registered with this email');
            } else {
                const newUser = new User({
                    name,
                    email,
                    password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                res.redirect('/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
});

router.get('/login', forwardAuthenticated, (req, res) => {
    res.render('login');
});

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next);
});

router.get('/found-item', (req, res) => {
    res.render('found-item');
});

router.get('/lost-item', (req, res) => {
    res.render('lost-item');
});

module.exports = router;