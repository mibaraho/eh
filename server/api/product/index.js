'use strict';

var express = require('express');
var controller = require('./product.controller');

import * as auth from '../../auth/auth.service';


var router = express.Router();

router.get('/m/:id/products', auth.isAuthenticated(), controller.index);
router.get('/products/search', controller.search);
router.get('/products/:id', auth.isAuthenticated(), controller.show);
router.post('/m/:id/products', auth.isAuthenticated(), controller.create);
router.put('/products/:id', auth.isAuthenticated(), controller.update);
router.put('/products/:id/approve', auth.isAuthenticated(), controller.approve);
router.patch('/products/:id', auth.isAuthenticated(), controller.update);
router.delete('/products/:id', auth.isAuthenticated(), controller.destroy);
router.post('/products/validate', controller.validate);

module.exports = router;
