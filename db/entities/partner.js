'use strict'

const mongoose = require('mongoose')
const timestamps = require('mongoose-timestamp')
const mongoosePaginate = require('mongoose-paginate')
const _ = require('lodash')
const Schema = mongoose.Schema
const ObjectId = mongoose.Schema.Types.ObjectId
const {User} = require('../')
mongoose.Promise = global.Promise

const proprieties = {
  name: {
    type: String,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      default: [0, 0]
    }
  },
  contact: {
    email: {
      type: String,
      unique: true
    }
  },
  owners: [{
    type: ObjectId,
    ref: User
  }],
  owns: [{
    type: ObjectId,
    ref: User
  }]
}

const pickFriendly = ['name', 'location', 'contact']

const options = {
  collection: 'partners',
  id: true,
  safe: true,
  versionKey: false,
  timestamps: false
}

const partnerSchema = new Schema(proprieties, options)
partnerSchema.plugin(timestamps)
partnerSchema.plugin(mongoosePaginate)
partnerSchema.plugin(require('mongoose-keywords'), {
  paths: ['name']
})
partnerSchema.index({
  location: '2dsphere'
})
const Partner = mongoose.model('Partner', partnerSchema)
module.exports = Partner

module.exports.controller = {
  insert: d => {
    return new Promise((resolve, reject) => {
      Partner.create(d)
        .then(data => resolve(data))
        .catch(err => reject({
          message: err,
          status: 409,
          code: 5,
          friendlyMsg: 'Parceiro já existe',
          console: false
        }))
    })
  },
  idExists: id => {
    return new Promise((resolve, reject) => {
      Partner.find({
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
      Partner.findOne(q).exec()
        .then(data => {
          _.isEmpty(data) ? reject({
            status: 401,
            code: 2,
            friendlyMsg: 'Informações incorretas',
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
  },
  selectByID: id => {
    return new Promise((resolve, reject) => {
      Partner.findOne({
        _id: id
      }).exec()
        .then(data => {
          _.isEmpty(data) ? reject({
            status: 401,
            code: 2,
            friendlyMsg: 'Informações incorretas',
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
  },
  update: q => {
    return new Promise((resolve, reject) => {
      Partner.findByIdAndUpdate(q.id, q, {
        new: true
      }).exec()
        .then(data => {
          _.isEmpty(data) ? reject({
            status: 401,
            code: 2,
            friendlyMsg: 'Informações incorretas',
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
  },
  delete: q => {
    return new Promise((resolve, reject) => {
      Partner.remove(q).exec()
        .then(data => {
          _.isEmpty(data) ? reject({
            status: 401,
            code: 2,
            friendlyMsg: 'Informações incorretas',
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
  },
  selectByOwnerID: (id, idRestaurante) => {
    return new Promise((resolve, reject) => {
      Partner.find({_id: idRestaurante, owners: id}).exec()
        .then(data => {
          _.isEmpty(data) ? reject({
            status: 401,
            code: 2,
            friendlyMsg: 'Informações incorretas',
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
  },
  getAll: id => {
    return new Promise((resolve, reject) => {
      Partner.find({}).exec()
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
  },
  getAllFriendly: () => {
    return new Promise((resolve, reject) => {
      Partner.find({}).exec()
        .then(data => {
          _.pick(data, pickFriendly)
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
  },
  owns: (idOwner, idOwnado) => {
    return new Promise((resolve, reject) => {
      Partner.find({
        owners: idOwner,
        owns: idOwnado
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
  near: (long, lat, radius) => {
    return new Promise((resolve, reject) => {
      Partner.find({
        location: {
          $nearSphere: {
            $geometry: {
              type: 'Point',
              coordinates: [long, lat]
            },
            $maxDistance: radius
          }
        }
      })
        .then(data => {
          _.pick(data, pickFriendly)
          resolve(data)
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
