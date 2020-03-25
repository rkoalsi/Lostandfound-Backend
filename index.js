const express = require('express');
const app = express()
const port = 3010
const path = require('path')
const routes = require('./routes')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

mongoose.connect('mongodb://localhost:27017/books-app', {useNewUrlParser: true, useUnifiedTopology: true});
app.engine('ejs', require('ejs').__express)
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(routes)

app.listen(port, () => {console.log(`You are now listening on port: ${port}`)} )