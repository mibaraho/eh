'use strict';

var express = require('express');
var controller = require('./product-message.controller');

var router = express.Router();

router.get('/products/:id/messages', controller.index);
router.get('/product-messages/:id', controller.show);
router.post('/products/:id/messages', controller.create);
router.put('/product-messages/:id', controller.update);
router.patch('/product-messages/:id', controller.update);
router.delete('/product-messages/:id', controller.destroy);

module.exports = router;
