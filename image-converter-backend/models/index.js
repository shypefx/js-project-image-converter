'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const UserModel = require('./models/User');
const ConversionHistoryModel = require('./models/ConversionHistory');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/../config/config.json')[env];
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Load models and associate them
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// Associate models
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

// Define associations
const User = UserModel(sequelize);
const ConversionHistory = ConversionHistoryModel(sequelize);

User.hasMany(ConversionHistory, { as: 'conversionHistories', onDelete: 'CASCADE' });
ConversionHistory.belongsTo(User);

// Export sequelize and models
db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.User = User;
db.ConversionHistory = ConversionHistory;

module.exports = db;
