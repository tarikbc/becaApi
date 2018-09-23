'use strict'
const mongoose = require('mongoose')
const logger = require('../utils/logs')
const chalk = require('chalk')

const User = require('./entities/user')
const Partner = require('./entities/partner')

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

mongoose.connect(process.env.MONGODB_URI, {
  useMongoClient: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: 1000
}).catch(error => {
  console.log('Erro na conexão do MongoDB: "' + error + '".')
})

mongoose.connection.on('connecting', function () {
  console.log('Tentando conectar no servidor MongoDB... ')
})

mongoose.connection.on('connected', function () {
  console.log('MongoDB ' + chalk.green('conectado.'))
})

mongoose.connection.on('disconnected', function () {
  console.log('Conexão MongoDB desconectada.')
})

process.on('SIGINT', function () {
  mongoose.connection.close(function () {
    console.log('Conexão MongoDB desconectada por conta do desligamento do servidor.')
    process.exit(0)
  })
})

module.exports = {
  User,
  Partner
}
