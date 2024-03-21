const { Sequelize } = require('sequelize');
const config = require('../sequelize.config');

const sequelize = new Sequelize(config.development.database, config.development.username, config.development.password, {
  host: config.development.host,
  dialect: config.development.dialect,
  port: config.development.port,
  // Other options as needed
});

module.exports = sequelize;
