var express = require('express');
var router = express.Router();
var sequelize = require('../db/connections.js').sequelize;
const Sequelize = require('sequelize');
const userModel = require('../db/schemas/userSchema.js');
const expertModel = require('../db/schemas/expertSchema.js');

var _ = require('lodash');
var config = require('./../config.json');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcrypt-nodejs');

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

// CREATE JSON WEB TOKEN
function createToken(user) {
  return jwt.sign(_.omit(user, 'password'), config.secret, { expiresIn: 60*60*5 });
}

// GET ALL USERS
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
  }).catch(function (err) {
    res.send(err);
  });
});

//http://localhost:2300/api/users/topActiveExperts/food
//http://localhost:2300/api/users/topActiveExperts/sports

// LOGIN EXISTING USER
router.post('/users/login', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  userModel.findOne({ where: {username: req.body.username}}).then(function(user) {
    if (!user) {
      return res.status(401).send(null);
    }

    bcrypt.compare(password, user.get('password'), function(err, match) {
      if (!match) {
        return res.status(401).send(null);
      }

      res.status(201).send(
        //{id_token: createToken(user)}
        user
      );
    });
  });
});

// SIGNUP NEW USER
router.post('/users', function(req, res) {
  var username = req.body.username;
  var password = req.body.password;
  var shopperExpert = req.body.shopperExpert;

  userModel.findOne({ where: {username: req.body.username}}).then(function(user) {
    if (user) {
      return res.status(400).send(null);
    } else {
      bcrypt.hash(password, null, null, function(err, hash) {
        userModel.create({
          username: username,
          password: hash,
          shopperExpert: shopperExpert
        }).then(function(user) {
          res.status(201).send(
          //{id_token: createToken(user)}
          user
          );
        });
      });
    }
  });
});

// UPDATE USER ACCOUNT
router.put('/users/:id', function(req, res) {
  // Object with property to update and new value
  var attributes = req.body.attributes;
  userModel.findOne({ where: {id: req.params.id}})
  .then(function(user) {
    if (!user) {
      return res.status(401).send(null);
    } else {
      user.update(attributes)
      .then(function(user) {
        console.log('Updated User:', user);
        res.status(201).send(JSON.stringify('User Updated.'));
      });
    }
  });
});

module.exports = router;