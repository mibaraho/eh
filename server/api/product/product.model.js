'use strict';

export default function(sequelize, DataTypes) {
  var Product = sequelize.define('Product', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    name: {
      allowNull: false,
      type: DataTypes.STRING(2047)
    },
    model: DataTypes.STRING(2047),
    brand: DataTypes.STRING(2047),
    category: DataTypes.STRING(2047),
    code: DataTypes.STRING(2047),
    description: DataTypes.TEXT,
    content: DataTypes.TEXT,
    price: DataTypes.DOUBLE,
    stock: DataTypes.DOUBLE,
    status: {
      allowNull: false,
      defaultValue: 'created',
      type: DataTypes.STRING
    },
    validationStatus: {
      allowNull: false,
      defaultValue: 'pending',
      type: DataTypes.STRING
    }
  });

  var User = sequelize.import('../user/user.model');
  Product.belongsTo(User, { as: 'CreatedBy' });
  Product.belongsTo(User, { as: 'UpdatedBy' });

  return Product;
}
