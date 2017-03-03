var Sequelize = require('sequelize');
var sequelize = require('../connections.js').sequelize;
const userModel = require('./userSchema.js');

var expertModel = sequelize.define('expert', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  home: Sequelize.BOOLEAN,
  food: Sequelize.BOOLEAN,
  technology: Sequelize.BOOLEAN,
  womensFashion: Sequelize.BOOLEAN,
  mensFashion: Sequelize.BOOLEAN,
  sports: Sequelize.BOOLEAN,
  entertainment: Sequelize.BOOLEAN
});

userModel.hasOne(expertModel); //1:1 - 1 set of expertise per user
//adds field userId references table users ('id') on expertModel

expertModel.sync({force: false}).then(function () {
  //force true drops table if it exists, so set to false for easy seeding
  console.log('experts table created');
});

module.exports = expertModel;