'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const routes = require('./routes/index')


const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(express.static('views'))
app.use(routes)

module.exports = app
