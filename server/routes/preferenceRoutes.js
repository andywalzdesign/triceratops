var express = require('express');
var router = express.Router();
const preferenceModel = require('../db/schemas/preferenceSchema.js');

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/preferences', function(req, res) {
  preferenceModel.findAll().then(function(preferences) {
     res.json(preferences);
  });
});

module.exports = router;
