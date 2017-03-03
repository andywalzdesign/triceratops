const fs = require('fs');
const userModel = require('./db/schemas/userSchema.js');
const expertModel = require('./db/schemas/expertSchema.js');
const chatModel = require('./db/schemas/chatSchema.js');
const categoryModel = require('./db/schemas/categorySchema.js');
const subcategoryModel = require('./db/schemas/subcategorySchema.js');
const preferenceModel = require('./db/schemas/preferenceSchema.js');
const ratingModel = require('./db/schemas/ratingSchema.js');

//mongo

//Seed chat model data

chatModel.remove({}, function(err) {
  console.log('chatModel removed');
});

fs.readFile(__dirname + '/db/seedData/chatData.json', function(err, messages) {
  if (err) throw err;
  JSON.parse(messages).forEach(function(message) {
    chatModel.create(message, function(err, newMessageAdded) {
      if (err) throw err;
      console.log('New Message Added', newMessageAdded);
    });
  });
});

//pg

//Seed User Model Data

userModel.destroy({
  where: {}
});

fs.readFile(__dirname + '/db/seedData/userData.json', function(err, users) {
  if (err) throw err;
  JSON.parse(users).forEach(function(user) {
    console.log('user', user);
    userModel.create(user, function(err, newUserAdded) {
      if (err) throw err;
      console.log('New User Added', newUserAdded);
    });
  });
});

// Seed Expert Model Data

expertModel.destroy({
  where: {}
});

fs.readFile(__dirname + '/db/seedData/expertData.json', function(err, experts) {
  if (err) throw err;
  JSON.parse(experts).forEach(function(expert) {
    expertModel.create(expert, function(err, newExpertAdded) {
      if (err) throw err;
      console.log('New Expert Added', newExpertAdded);
    });
  });
});

//Seed Preference Model Data

preferenceModel.destroy({
  where: {}
});

fs.readFile(__dirname + '/db/seedData/preferenceData.json', function(err, preferences) {
  if (err) throw err;
  JSON.parse(preferences).forEach(function(preference) {
    preferenceModel.create(preference, function(err, newPreferenceAdded) {
      if (err) throw err;
      console.log('New preference Added', newPreferenceAdded);
    });
  });
});

//Seed Ratings Model Data

ratingModel.destroy({
  where: {}
});

fs.readFile(__dirname + '/db/seedData/ratingData.json', function(err, ratings) {
  if (err) throw err;
  JSON.parse(ratings).forEach(function(rating) {
    ratingModel.create(rating, function(err, newRatingAdded) {
      if (err) throw err;
      console.log('New rating Added', newRatingAdded);
    });
  });
});


// Seed Category Model Data

categoryModel.destroy({
  where: {}
});

fs.readFile(__dirname + '/db/seedData/categoryData.json', function(err, categories) {
  if (err) throw err;
  JSON.parse(categories).forEach(function(category) {
    categoryModel.create(category, function(err, newCategoryAdded) {
      if (err) throw err;
      console.log('New category Added', newCategoryAdded);
    });
  });
});


//Seed SubCategory Model Data

subcategoryModel.destroy({
  where: {}
});

fs.readFile(__dirname + '/db/seedData/subcatData.json', function(err, subcats) {
  if (err) throw err;
  JSON.parse(subcats).forEach(function(subcat) {
    subcategoryModel.create(subcat, function(err, newSubCatAdded) {
      if (err) throw err;
      console.log('New subcat Added', newSubCatAdded);
    });
  });
});

