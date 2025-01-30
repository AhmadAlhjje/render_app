const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('football field', 'root', '', {
  host: 'localhost',
  dialect: 'mysql',
});

module.exports = sequelize;
