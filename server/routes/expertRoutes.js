var express = require('express');
var router = express.Router();
const expertModel = require('../db/schemas/expertSchema.js');


// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/experts', function(req, res) {
  expertModel.findAll().then(function(experts) {
     res.json(experts);
  });
});

module.exports = router;
