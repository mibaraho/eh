'use strict';

export default function(sequelize, DataTypes) {
  var ProductMessage = sequelize.define('ProductMessage', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    content: DataTypes.TEXT,
    tags: DataTypes.TEXT,
    code: DataTypes.STRING(2047),
    status: {
      allowNull: false,
      defaultValue: 'created',
      type: DataTypes.STRING
    }
  });

  var User = sequelize.import('../user/user.model');
  ProductMessage.belongsTo(User, { as: 'CreatedBy' });
  ProductMessage.belongsTo(User, { as: 'UpdatedBy' });

  var Product = sequelize.import('../product/product.model');
  ProductMessage.belongsTo(Product);
  Product.hasMany(ProductMessage);

  var Merchant = sequelize.import('../merchant/merchant.model');
  ProductMessage.belongsTo(Merchant);
  Merchant.hasMany(ProductMessage);

  return ProductMessage;
}
