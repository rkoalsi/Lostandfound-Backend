const express = require('express')
const router = express.Router()
const bcrypt = require('bcryptjs')
const passport = require('passport')
const User = require('./models/User')

router.get('/', (req, res) => {
    res.render('index')
})

router.use('/', express.static('./static'));

router.get('/found-form', (req, res) => {
    res.render('found-form')
})

router.get('/lost-form', (req, res) => {
    res.render('lost-form')
})

router.get('/lost', (req, res) => {
    res.render('lost')
})

router.get('/found', (req, res) => {
    res.render('found');
})

router.get('/found-item', (req, res) => {
    res.render('found-item')
})

router.get('/lost-item', (req, res) => {
    res.render('lost-item')
})
module.exports = router