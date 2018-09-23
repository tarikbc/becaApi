'use strict'

const express = require('express')
const Scaledrone = require('scaledrone-node');
const router = express.Router()
const drone = new Scaledrone('ywbv2UbC8lPdqaH9');

const room = drone.subscribe('observable-beca');

room.on('open', (error) => {
  if (error) {
    return console.error(error);
  }
  console.log('Conectado Scaledrone');
});

room.on('data', (data) => {
  console.log('Dados recebidos:');
  console.log(data);
});

room.on('members', function (members) {
  console.log('Membros:')
  console.log(members)
});

room.on('member_join', function (member) {
  console.log('Usuário entrou')
  console.log(member)
});

room.on('member_leave', function (member) {
  console.log('Usuário saiu')
  console.log(member)
});


router.get('/', (request, response) => {
  response.render('..views/')
})

router.post('/api/buy', function (request, response, next) {
  drone.publish({
    room: 'observable-beca',
    message: {
      buyer: request.body.buyer,
      product: request.body.product,
      price: request.body.price
    }
  })
  response.send({
    sent:true
  })
})

router.get('/api/ping', (request, response) => {
  response.json({'pong': true})
})


router.use(function (request, response, next) {
  next({
    status: 404,
    code: 3,
    friendlyMsg: 'Rota não encontrada.'
  })
})

module.exports = router
