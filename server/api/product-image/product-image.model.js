'use strict';

export default function(sequelize, DataTypes) {
  var ProductImage = sequelize.define('ProductImage', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    provider: {
      allowNull: false,
      defaultValue: 'local',
      type: DataTypes.STRING
    },
    title: DataTypes.TEXT,
    description: DataTypes.TEXT,
    storageUrl: DataTypes.STRING(2047),
    storagePath: DataTypes.STRING(2047),
    fileKey: DataTypes.STRING(2047),
    originalServerPath: {
      allowNull: false,
      type: DataTypes.STRING(2047)
    },
    originalFileName: {
      allowNull: false,
      type: DataTypes.STRING(2047)
    },
    fileName: DataTypes.STRING(2047),
    fileType: {
      allowNull: false,
      type: DataTypes.STRING
    },
    fileSize: DataTypes.INTEGER,
    position: {
      allowNull: false,
      defaultValue: 0,
      type: DataTypes.INTEGER
    },
    status: {
      allowNull: false,
      defaultValue: 'created',
      type: DataTypes.STRING
    }
  }, {

    /**
     * Virtual Getters
     */
    getterMethods: {
      // Public profile information
      url: function() {
        if(this.provider === 'local'){
          return this.storagePath+'/'+this.fileName;
        } else if(this.provider === 's3'){
          return this.storageUrl+'/'+this.fileKey;
        }
        return ''
      }
    }
  });

  var User = sequelize.import('../user/user.model');
  ProductImage.belongsTo(User, { as: 'CreatedBy' });
  ProductImage.belongsTo(User, { as: 'UpdatedBy' });

  var Product = sequelize.import('../product/product.model');
  ProductImage.belongsTo(Product);
  Product.hasMany(ProductImage);

  return ProductImage
}
