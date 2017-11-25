/**
 * Sequelize initialization module
 */

'use strict';

import path from 'path';
import config from '../config/environment';
import Sequelize from 'sequelize';

var db = {
  Sequelize,
  sequelize: new Sequelize(config.sequelize.uri, config.sequelize.options)
};

// Insert models below
db.ValidationPolicyInterval = db.sequelize.import('../api/validation-policy-interval/validation-policy-interval.model');
db.ProductImage = db.sequelize.import('../api/product-image/product-image.model');
db.Merchant = db.sequelize.import('../api/merchant/merchant.model');
db.ProductMessage = db.sequelize.import('../api/product-message/product-message.model');
db.Product = db.sequelize.import('../api/product/product.model');
db.Thing = db.sequelize.import('../api/thing/thing.model');
db.User = db.sequelize.import('../api/user/user.model');

export default db;
