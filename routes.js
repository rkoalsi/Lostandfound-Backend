const express = require('express')
const router = express.Router()

router.get('/', (req,res) => {
    res.render('index')
})

router.get('/found-form', (req,res) => {
    res.render('found-form')
}) 

router.get('/lost-form', (req,res) => {
    res.render('lost-form')
})

router.get('/lost',(req,res) => {
    res.render('lost')
})

router.get('/found', (req,res) => {
    res.sendFile(__dirname +'/found.html')
})

module.exports = router