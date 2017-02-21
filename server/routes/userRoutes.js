var express = require('express');
var router = express.Router();
var sequelize = require('../db/connections.js').sequelize;
const Sequelize = require('sequelize');
const userModel = require('../db/schemas/userSchema.js');
const expertModel = require('../db/schemas/expertSchema.js');



// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

//get all users

router.get('/users', function(req, res) {
  userModel.findAll().then(function(users) {
    res.json(users);
  });
});

//Get a particular user

router.get('/users/:id', function(req, res) {
  userModel.findAll({
    where: {
      id: req.params.id
    }
  }).then(function(users) {
    res.json(users);
  });
});

//get all users or get all experts (expert: true, non-expert: false)

router.get('/users/expert/:userType', function(req, res) {
  userModel.findAll({
    where: {
      shopperExpert: req.params.userType
    }
  }).then(function(users) {
    res.json(users);
  });
});

//get a single user of a particular type
//e.g. i want to check out if user 1 is still an active expert

router.get('/users/:id/:userType', function(req, res) {
  userModel.findAll({
    where: {
      id: req.params.id,
      shopperExpert: req.params.userType
    }
  }).then(function(users) {
    res.json(users);
  });
});

//find user by username

router.get('/users/username/:username', function(req, res) {
  userModel.findAll({
    where: {
      username: req.params.username
    }
  }).then(function(users) {
    res.json(users);
  });
});


//get top n active experts of a particular category
//ordered by average rating
//http://localhost:2300/api/users/topActiveExperts/food
//http://localhost:2300/api/users/topActiveExperts/sports


router.get('/users/topActiveExperts/:category/:count', function(req, res) {

var category = req.params.category || "sports";
var count = req.params.count || 50;

const expertQuery =
`SELECT "users".*, "experts"."`+category+`"
FROM "users"
INNER JOIN "experts" ON ("users"."id" = "experts"."userId")
WHERE ("users"."shopperExpert" = true
AND "users"."active"= true
AND "experts"."`+category+`" = true)
ORDER BY "users"."averageRating" DESC
LIMIT `+count+`;
`;

  sequelize.query(expertQuery).then(function(users) {
    console.log(users[0]);
    res.json(users[0]);
  });
});

//http://localhost:2300/api/users/topActiveExperts/food
//http://localhost:2300/api/users/topActiveExperts/sports

module.exports = router;
