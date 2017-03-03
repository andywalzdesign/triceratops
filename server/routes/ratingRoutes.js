var express = require('express');
var router = express.Router();
const ratingModel = require('../db/schemas/ratingSchema.js');

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/ratings', function(req, res) {
  ratingModel.findAll().then(function(ratings) {
    res.json(ratings);
  });
});

router.post('/ratings/rate', function(req, res) {

  var rating = {
    userRating: req.body.userRating,
    senderId: req.body.senderId,
    receiverId: req.body.receiverId
  };

  console.log('rating', rating);

  ratingModel.create(rating, function(err, newRatingAdded) {
    if (err) throw err;
    console.log('New rating Added', newRatingAdded);
    return newRatingAdded;
  }).then(function(rating) {
    res.status(201).send(rating);
  });
});

module.exports = router;
