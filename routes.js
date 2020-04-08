const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');
const passport = require('passport');
const {
  getReadUrl,
  getSignedUrl,
  uploadBuffer
} = require('./config/aws');
const {
  forwardAuthenticated,
  ensureAuthenticated
} = require('./config/auth');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, getSignedUrl)
  }
})
var upload = multer({
  storage: storage
})
router.get('/', (req, res) => {
  res.render('index');
});

router.use('/', express.static('./static'));

router.get('/found-form', (req, res) => {
  res.render('found-form');
});

router.post('/found-form', upload.single('image'), (req, res) => {
  var status = true;
  var completed = false;
  const {
    name,
    type,
    about,
    image,
    where
  } = req.body;
  let errors = [];
  if (!name || !type || !about || !where) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }

  if (errors.length > 0) {
    res.render('found-form', {
      name,
      type,
      about,
      image,
      where
    });
  } else {
    const newItem = new Item({
      name,
      type,
      about,
      where,
      image,
      status,
      completed
    });
    // console.log(image)
    newItem.save().then(user => {
      uploadBuffer(image, {
        name: newItem._id
      })
      req.flash('success_msg', 'Your item has been posted');
      res.redirect('/found');
    });
  }
});

router.get('/lost-form', (req, res) => {
  res.render('lost-form');
});

router.post('/lost-form', upload.single('image'), (req, res) => {
  var status, completed;
  status = completed = false;
  const {
    name,
    type,
    about,
    image,
    where
  } = req.body;
  let errors = [];

  if (!name || !type || !about || !where) {
    errors.push({
      msg: 'Please enter all fields'
    });
  }
  if (errors.length > 0) {
    res.render('lost-form', {
      errors,
      name,
      type,
      image,
      about,
      where
    });
  } else {
    const newItem = new Item({
      name,
      about,
      type,
      where,
      image,
      status,
      completed
    });
    // console.log(image)
    newItem.save().then(user => {
      uploadBuffer(image, {
        name: newItem._id
      })
      req.flash('success_msg', 'Your item has been posted');
      res.redirect('/lost');
    });
  }
})
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
      errors,
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
        errors.push({
          msg: 'Email already exists'
        });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2
        });
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
            console.log(newUser);
            newUser
              .save()
              .then(user => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
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

router.get('/single-lost', (req, res) => {
  res.render('single-lost');
});

router.get('/single-found', (req, res) => {
  res.render('single-found');
});

module.exports = router