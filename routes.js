const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Item = require('./models/Item');
const Claim = require('./models/Claim');
const passport = require('passport');
const { getReadUrl, uploadBuffer } = require('./config/aws');
const { forwardAuthenticated, ensureAuthenticated } = require('./config/auth');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
});

router.get('/', (req, res) => {
  res.render('index');
});

router.use('/', express.static('./static'));

router.get('/found-form', ensureAuthenticated, (req, res) => {
  res.render('found-form');
});

router.post('/found-form', upload.single('image'), (req, res) => {
  var status = true;
  var completed = false;
  const { name, type, about, image, where } = req.body;
  let errors = [];
  if (!name || !type || !about || !where) {
    errors.push({
      msg: 'Please enter all fields',
    });
  }
  if (errors.length > 0) {
    res.render('found-form', {
      errors,
      name,
      type,
      about,
      image,
      where,
    });
  } else {
    const newItem = new Item({
      name,
      type,
      about,
      where,
      image,
      status,
      completed,
    });
    newItem.save().then((user) => {
      const name = newItem._id.toString() + '.jpg';
      const url = getReadUrl(name);
      uploadBuffer(req.file.buffer, {
        name,
      }).then((resUpload) => {
        user.image = url;
        user.save();
      });
      req.flash('success_msg', 'Your item has been posted');
      res.redirect('/found');
    });
  }
});

router.get('/lost-form', ensureAuthenticated, (req, res) => {
  res.render('lost-form');
});

router.post('/lost-form', upload.single('image'), (req, res) => {
  let status, completed;
  status = completed = false;
  const { name, type, about, image, where } = req.body;

  let errors = [];

  if (!name || !type || !about || !where) {
    errors.push({
      msg: 'Please enter all fields',
    });
  }
  if (errors.length > 0) {
    res.render('lost-form', {
      errors,
      name,
      type,
      image,
      about,
      where,
    });
  } else {
    const newItem = new Item({
      name,
      about,
      type,
      where,
      image,
      status,
      completed,
    });
    newItem.save().then((user) => {
      const name = newItem._id.toString() + '.jpg';
      const url = getReadUrl(name);
      uploadBuffer(req.file.buffer, {
        name,
      }).then((resUpload) => {
        user.image = url;
        user.save();
      });
      req.flash('success_msg', 'Your item has been posted');
      res.redirect('/lost');
    });
  }
});

router.get('/register', forwardAuthenticated, (req, res) => {
  res.render('register');
});

router.post('/register', (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({
      msg: 'Please enter all fields',
    });
  }

  if (password != password2) {
    errors.push({
      msg: 'Passwords do not match',
    });
  }

  if (password.length < 6) {
    errors.push({
      msg: 'Password must be at least 6 characters',
    });
  }

  if (errors.length > 0) {
    res.render('register', {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({
      email: email,
    }).then((user) => {
      if (user) {
        errors.push({
          msg: 'Email already exists',
        });
        res.render('register', {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  'success_msg',
                  'You are now registered and can log in'
                );
                res.redirect('/login');
              })
              .catch((err) => console.log(err));
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
    failureFlash: true,
  })(req, res, next);
});

router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success_msg', 'You have been successfully logged out');
  res.redirect('/login');
});

router.get('/found', ensureAuthenticated, (req, res) => {
  let { search = '' } = req.query;
  let search2 = search.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  if(search!==''){
    Item.find({ name: search2, status: true }, function (err, data) {
      if (err) throw err;
      res.render('found-item', { items: data });
    });
  } else{
    Item.find({status:true}, function(err,data){
      res.render('found-item', {items:data});
    })
  }
});

router.get('/lost', ensureAuthenticated, (req, res) => {
  let { search = '' } = req.query;
  let search2 = search.replace(/\w\S*/g, function (txt) {
    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
  });
  if(search!==''){
    Item.find({ name: search2, status: false }, function (err, data) {
      if (err) throw err;
      res.render('lost-item', { items: data });
    });
  } else{
    Item.find({status:false}, function(err,data){
      res.render('lost-item', {items:data});
    })
  }
});

router.get('/single-lost/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params;
  Item.findById(id).then(function (data) {
    res.render('single-lost', { item: data });
  });
});
router.post('/single-lost/:id', (req, res) => {
  const { name, number, item_name, item_about, item_id } = req.body;
  let errors = [];
  if (!name || !number) {
    errors.push({
      msg: 'Please enter all fields',
    });
  }

  if (number.length < 10) {
    errors.push({
      msg: 'Phone Number must be at least 10 characters',
    });
  }

  if (errors.length > 0) {
    res.render('single-found', {
      errors,
      name,
      number,
    });
  } else {
    const newClaim = new Claim({
      name,
      number,
      item_name,
      item_about,
      item_id,
    });
    newClaim.save().then((user) => {
      req.flash('success_msg', 'Your claim has been submitted');
      res.redirect('/lost');
    });
  }
});

router.get('/single-found/:id', ensureAuthenticated, (req, res) => {
  const { id } = req.params;
  Item.findById(id).then(function (data) {
    res.render('single-found', { item: data });
  });
});

router.post('/single-found/:id', (req, res) => {
  const { name, number, item_name, item_about, item_id } = req.body;
  let errors = [];
  if (!name || !number) {
    errors.push({
      msg: 'Please enter all fields',
    });
  }

  if (number.length < 10) {
    errors.push({
      msg: 'Phone Number must be at least 10 characters',
    });
  }

  if (errors.length > 0) {
    res.render('single-found', {
      errors,
      name,
      number,
    });
  } else {
    const newClaim = new Claim({
      name,
      number,
      item_name,
      item_about,
      item_id,
    });
    newClaim.save().then((user) => {
      req.flash('success_msg', 'Your claim has been submitted');
      res.redirect('/found');
    });
  }
});

module.exports = router;