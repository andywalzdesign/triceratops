var mongoose = require('../connections.js').mongoose;

var chatSchema = mongoose.Schema({
  _id: { type: String, required: true },
  chatSessionID: { type: String, required: true },
  createdAt: { type: Date, required: true },
  text: { type: String },
  user: {
    _id: { type: Number, required: true },
    name: { type: String, required: true }
  },
});

var chatModel = mongoose.model('chatSchema', chatSchema);

module.exports  = chatModel;