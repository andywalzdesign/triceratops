var Sequelize = require('sequelize');
var sequelize = require('../connections.js').sequelize;
const categoryModel = require('./categorySchema.js');

var subcatModel = sequelize.define('subcategory', {
  id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
  subcategoryName: Sequelize.STRING,
  description: Sequelize.STRING,
  image: Sequelize.STRING
});

categoryModel.hasMany(subcatModel);
subcatModel.belongsTo(categoryModel);
//1:M - 1 category can have many subcategories
//"categoryId" INTEGER REFERENCES "categories" ("id")

subcatModel.sync({force: false}).then(function () {
  //force true drops table if it exists, so set to false for easy seeding
  console.log('subcat table created');
});

module.exports = subcatModel;