var express = require('express');
var router = express.Router();
const chatModel = require('../db/schemas/chatSchema.js');

// middleware that is specific to this router
// router.use(function timeLog (req, res, next) {
//   console.log('Time: ', Date.now())
//   next()
// })

router.get('/chat/messages', function(req, res) {
  console.log('Finding messages...');
  chatModel.find({}, function(err, messages) {
    res.send(messages);
  });
});

// SAVE MESSAGE TO DATABASE
router.post('/chat/messages', function(req, res) {
  console.log('*** REQUEST BODY ***', req.body.message);
  chatModel.create(req.body.message, function(err, savedMessage) {
    if (err) {
      console.log(err);
    } else {
      res.send('Message Saved.');
    }
  });
});

module.exports = router;