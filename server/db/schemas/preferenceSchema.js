const Sequelize = require('sequelize');
const sequelize = require('../connections.js').sequelize;
const userModel = require('./userSchema.js');

var preferenceModel = sequelize.define('preference', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  home: Sequelize.BOOLEAN,
  food: Sequelize.BOOLEAN,
  technology: Sequelize.BOOLEAN,
  womensFashion: Sequelize.BOOLEAN,
  mensFashion: Sequelize.BOOLEAN,
  sports: Sequelize.BOOLEAN,
  entertainment: Sequelize.BOOLEAN
});

userModel.hasOne(preferenceModel); //1:1 - 1 set of preferences per user
//adds field userId references table users ('id') on preferenceModel

preferenceModel.sync().then(function() {
  //force true drops table if it exists, so set to false for easy seeding
  console.log('prefs table created');
});

module.exports = preferenceModel;
