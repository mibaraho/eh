'use strict';

export default function(sequelize, DataTypes) {
  var Merchant = sequelize.define('Merchant', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: DataTypes.STRING(2047),
    description: DataTypes.TEXT,
    code: DataTypes.STRING(2047),
    status: {
      allowNull: false,
      defaultValue: 'created',
      type: DataTypes.STRING
    }
  });

  var User =  sequelize.import('../user/user.model');
  User.belongsTo(Merchant);

  var Product =  sequelize.import('../product/product.model');
  Merchant.hasMany(Product);

  var ProductImage =  sequelize.import('../product-image/product-image.model');
  Merchant.hasMany(ProductPicture);

  var ProductMessage =  sequelize.import('../product-message/product-message.model');
  Merchant.hasMany(ProductMessage);

  return Merchant;
}
