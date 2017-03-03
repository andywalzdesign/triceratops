var Sequelize = require('sequelize');
var sequelize = require('../connections.js').sequelize;

var userModel = sequelize.define('user', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  username: Sequelize.STRING,
  password: Sequelize.STRING,
  averageRating: { type: Sequelize.DECIMAL(10, 2), defaultValue: 0},
  shopperExpert: { type: Sequelize.BOOLEAN, defaultValue: false },
  active: { type: Sequelize.BOOLEAN, defaultValue: false },
  closedChatSessions: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
  userPreferences: { type: Sequelize.JSONB, defaultValue: {} }
});

userModel.sync({force: false}).then(function () {
  //force true drops table if it exists, so set to false for easy seeding
  console.log('users table created');
});

module.exports = userModel;