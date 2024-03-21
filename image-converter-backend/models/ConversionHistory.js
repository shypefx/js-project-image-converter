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
    // Add any other fields as needed
  }, {
    timestamps: false, // Disable timestamps
  });

  // Define association with User model
  ConversionHistory.associate = (models) => {
    ConversionHistory.belongsTo(models.User, {
      foreignKey: {
        allowNull: false,
      },
    });
  };

  return ConversionHistory;
};
