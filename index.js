require('dotenv').config();
const express = require('express');
const app = express();
const port = process.env.PORT || 3010;
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
require('./config/passport')(passport);
const cookieParser = require('cookie-parser');
var flash = require('connect-flash');

mongoose
  .connect('mongodb://localhost:27017/lost-and-found', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

app.use(cookieParser());
app.engine('ejs', require('ejs').__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);
app.use(
  session({
    secret: 'doob',
    resave: true,
    saveUninitialized: true
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json());
app.use(flash());
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});
app.use(require('./routes'));

app.listen(port, () => {
  console.log(`You are now listening on port: ${port}`);
});
