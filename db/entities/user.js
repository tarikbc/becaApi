'use strict'

const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const Schema = mongoose.Schema
mongoose.Promise = global.Promise
// const ObjectId = mongoose.Schema.Types.ObjectId
const _ = require('lodash')
const utils = require('../../utils')

const proprieties = {
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  birthDate: Date,
  gender: String,
  cpf: {
    type: String
  },
  type: String,
  phone: {
    number: Number,
    verified: {
      type: Boolean,
      default: false
    }
  },
  photo: {
    source: String,
    url: String
  },
  access: {
    account: {
      type: String,
      bcrypt: true
    },
    facebook: {
      token: String
    },
    google: Object
  },
  twofa: [{
    request: String,
    method: String,
    code: String,
    expires: Date,
    createdAt: Date,
    used: Boolean
  }],
  permissions: {
    changePassword: {
      type: Boolean,
      default: false
    }
  }
}
const options = {
  collection: 'users',
  id: true,
  safe: true,
  versionKey: false,
  timestamps: false
}

const userSchema = new Schema(proprieties, options)

userSchema.plugin(timestamps)
const User = mongoose.model('User', userSchema)
module.exports = User

module.exports.controller = {
  insert: d => {
    return new Promise((resolve, reject) => {
      User.create(d)
        .then(data => {
          data = data.toObject()
          data.status = utils.status(data)
          resolve(data)
        })
        .catch(err => reject({
          message: err,
          status: 409,
          code: 5,
          friendlyMsg: 'Erro ao inserir usuário',
          console: false
        }))
    })
  },
  idExists: id => {
    return new Promise((resolve, reject) => {
      User.find({
        _id: id
      }, {
        _id: 1
      }).limit(1).exec()
        .then(data => {
          resolve(!_.isEmpty(data))
        })
        .catch(err => {
          reject({
            message: err,
            status: 400,
            code: 4,
            friendlyMsg: 'Erro de solicitação'
          })
        })
    })
  },
  select: q => {
    return new Promise((resolve, reject) => {
      User.findOne(q).lean().exec()
        .then(data => {
          if (_.isEmpty(data)) {
            reject({
              status: 401,
              code: 2,
              friendlyMsg: 'Informações incorretas',
              console: false
            })
          } else {
            data.status = utils.status(data)
            resolve(data)
          }
        })
        .catch(err => {
          reject({
            message: err,
            status: 400,
            code: 4,
            friendlyMsg: 'Erro de solicitação'
          })
        })
    })
  },
  selectByID: id => {
    return new Promise((resolve, reject) => {
      User.findOne({
        _id: id
      }).lean().exec()
        .then(data => {
          if (_.isEmpty(data)) {
            reject({
              status: 401,
              code: 2,
              friendlyMsg: 'Informações incorretas',
              console: false
            })
          } else {
            data.status = utils.status(data)
            resolve(data)
          }
        })
        .catch(err => {
          reject({
            message: err,
            status: 400,
            code: 4,
            friendlyMsg: 'Erro de solicitação'
          })
        })
    })
  },
  update: q => {
    return new Promise((resolve, reject) => {
      User.findByIdAndUpdate(q._id, q, {
        new: true
      }).lean().exec()
        .then(data => {
          if (_.isEmpty(data)) {
            reject({
              status: 401,
              code: 2,
              friendlyMsg: 'Informações incorretas',
              console: false
            })
          } else {
            data.status = utils.status(data)
            resolve(data)
          }
        })
        .catch(err => {
          reject({
            message: err,
            status: 400,
            code: 4,
            friendlyMsg: 'Erro de solicitação'
          })
        })
    })
  },
  delete: q => {
    return new Promise((resolve, reject) => {
      User.remove(q).lean().exec()
        .then(data => {
          if (_.isEmpty(data)) {
            reject({
              status: 401,
              code: 2,
              friendlyMsg: 'Informações incorretas',
              console: false
            })
          } else {
            data.status = utils.status(data)
            resolve(data)
          }
        })
        .catch(err => {
          reject({
            message: err,
            status: 400,
            code: 4,
            friendlyMsg: 'Erro de solicitação'
          })
        })
    })
  },
  getAll: () => {
    return new Promise((resolve, reject) => {
      User.find({}).exec()
        .then(data => {
          _.isEmpty(data) ? reject({
            status: 401,
            code: 2,
            friendlyMsg: 'Banco vazio.',
            console: false
          }) : resolve(data)
        })
        .catch(err => {
          reject({
            message: err,
            status: 400,
            code: 4,
            friendlyMsg: 'Erro de solicitação'
          })
        })
    })
  }
}
