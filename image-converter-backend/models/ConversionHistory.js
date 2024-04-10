// models/ConversionHistory.js
const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const ConversionHistory = sequelize.define('ConversionHistory', {
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    conversionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    imageSize: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  return ConversionHistory;
};
