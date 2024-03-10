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
  });

  return ConversionHistory;
};
