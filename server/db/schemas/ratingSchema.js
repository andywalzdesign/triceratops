const Sequelize = require('sequelize');
const sequelize = require('../connections.js').sequelize;
const userModel = require('./userSchema.js');

var ratingModel = sequelize.define('rating', {
  userRating: Sequelize.INTEGER,
  receiverId: Sequelize.INTEGER,
  senderId: Sequelize.INTEGER
});

userModel.hasOne(ratingModel, {as: 'senderId', foreignKey : 'senderId'});
userModel.hasOne(ratingModel, {as: 'receiverId', foreignKey : 'receiverId'}); //Two foreign keys referencing the same table

ratingModel.sync({ force: false }).then(function() {
  //force true drops table if it exists, so set to false for easy seeding
  console.log('rating table created');
});

module.exports = ratingModel;
