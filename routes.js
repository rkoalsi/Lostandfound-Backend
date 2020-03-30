const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const passport = require('passport');

router.get('/', (req, res) => {
  res.render('index');
});

router.use('/', express.static('./static'));

router.get('/found-form', (req, res) => {
  res.render('found-form');
});

router.get('/lost-form', (req, res) => {
  res.render('lost-form');
});

router.get('/lost', (req, res) => {
  res.render('lost');
});

router.get('/found', (req, res) => {
  res.render('found');
});

router.get('/register', (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Passwords do not match'
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password must be at least 6 characters'
    });
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
      } else {
        // create and save are two different approaches of writing data in a model, use either save or create.
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

router.get('/login', (req, res) => {
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
