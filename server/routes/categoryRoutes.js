var express = require('express');
var router = express.Router();
const categoryModel = require('../db/schemas/categorySchema.js');
const subcategoryModel = require('../db/schemas/subcategorySchema.js');

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/categories', function(req, res) {
  categoryModel.findAll().then(function(categories) {
     res.json(categories);
  });
});

module.exports = router;
