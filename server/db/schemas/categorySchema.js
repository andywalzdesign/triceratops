var Sequelize = require('sequelize');
var sequelize = require('../connections.js').sequelize;

var categoryModel = sequelize.define('category', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  categoryName: Sequelize.STRING,
  description: Sequelize.STRING,
  image: Sequelize.STRING
});

categoryModel.sync({force: false}).then(function () {
  //force true drops table if it exists, so set to false for easy seeding
  console.log('category table created');
});

module.exports = categoryModel;