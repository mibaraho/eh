'use strict';

export default function(sequelize, DataTypes) {
  var ValidationPolicyInterval = sequelize.define('ValidationPolicyInterval', {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true
    },
    intervalLowerLimit: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    intervalUpperLimit: {
      allowNull: false,
      type: DataTypes.DOUBLE
    },
    name: DataTypes.STRING(2047),
    description: DataTypes.STRING(2047),
    position: DataTypes.TEXT,
    action: DataTypes.TEXT,
    status: {
      allowNull: false,
      defaultValue: 'created',
      type: DataTypes.STRING
    }
  });
  return ValidationPolicyInterval;
}
