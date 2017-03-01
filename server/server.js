const express = require('express');
const app = express();
const router = express.Router();
const bodyparser = require('body-parser');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const chatRoutes = require('./routes/chatRoutes.js');
const expertRoutes = require('./routes/expertRoutes.js');
const preferenceRoutes = require('./routes/preferenceRoutes');
const ratingRoutes = require('./routes/ratingRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const morgan = require('morgan');

//Global App Middleware that applies to all routes
app.use(bodyparser());
app.use(cors());
app.use(morgan('dev'));

//Routing and Custom Middleware for each route
app.use('/api', userRoutes);
app.use('/api', chatRoutes);
app.use('/api', expertRoutes);
app.use('/api', preferenceRoutes);
app.use('/api', ratingRoutes);
app.use('/api', categoryRoutes);


// MOVED UNDER SOCKET.IO SETUP
// const PORT = 2300;
// app.listen(PORT, function(req, res) {
//   console.log('listening on port: ' + PORT);
// });

/////////////////////////////////////
////////// SOCKET.IO SETUP //////////
/////////////////////////////////////

const os = require('os');
const server = require('http').createServer(app);
const io = require('socket.io')(server);

// QUEUE OF USERS REQUESTING ASSISTANCE
let queue = {
  'HOME': [], // [user1, user2, user3]
  'FOOD': [], // [user4, user5]
  'TECH': [], // []
  'WOMEN\'S FASHION': [], // [user6]
  'MEN\'S FASHION': [], // []
  'ENTERTAINMENT': [] // [user7, user8]
};

// TEMPORARY ACTIVE EXPERT LIST (Hardcoded)
// Experts added and removed from Experts object when toggling Online/Offline client side
let experts = {
  // Expert ID as Prop
  1: {
    user: undefined,
    categories: ['HOME']
  }
};

// worker function that runs every ~30 seconds
// goes to the queue object
// for each category in the queue
  // if a user is in the queue
    // connect user with expert in that category (via findExpert Function)

// Repeat until all queues are empty or no experts available in category

//
let findExpert = function(category) {
  for (var expert in experts) {
    if (!experts[expert].user) {
      experts[expert].categories.forEach(function(cat) {
        if (cat === category) {
          experts[expert].user = queue[category].shift();
          return true;
        }
      });
    }
  }
  return false;
};

// DETERMINE IF USER CURRENTLY IN QUEUE
app.get('/api/userQueue', function(req, res) {
  if (queue.length) {
    res.send(true);
  } else {
    res.send(false);
  }
});

// DETERMINE HOW MANY USERS CURRENTLY IN CATEGORY QUEUE
app.get('/api/userQueue/queue/:category', function(req, res) {
  if (queue[req.params.category].length) {
    res.send(JSON.stringify(queue[req.params.category].length));
  } else {
    res.send(JSON.stringify(0));
  }
});

// REMOVE USER FROM USER QUEUE AND SEND TO EXPERT
app.get('/api/userQueue/getUser', function(req, res) {
  if (queue.length) {
    var user = queue.shift();
    console.log('New Queue:', queue);
    res.send(user);
  } else {
    res.send('User taken.');
  }
});

// REMOVE FIRST USER FROM CATEGORY USER QUEUE AND SEND TO EXPERT
app.get('/api/userQueue/getUser/:category', function(req, res) {
  if (queue.length) {
    var category = req.params.category;
    var user = queue[category].shift();
    console.log('New Queue:', queue);
    res.send(user);
  } else {
    res.send(JSON.stringify('User taken.'));
  }
});

// RUNS WHEN USER STARTS A SOCKET CONNECTION
io.on('connection', function(socket) {
  console.log('Client Connected:', socket.id);
  socket.emit('id', socket.id);

  // RUNS WHEN USER CREATES CHATROOM
  socket.on('createRoom', function(room, userId, username, category) {
    console.log('Joining Room:', room, 'User:', userId, 'Category:', category);
    socket.join(room);
    var user = {};
    user.id = userId;
    user.username = room;
    user.category = category;
    // Add room to user object
    user.room = room;

    console.log('Current Queue for Category:', queue[category]);

    io.in(room).emit('message', {message: '*** Finding Expert ***'});

    // FIRE FUNCTION TO LOOP OVER ACTIVE & AVAILABLE EXPERTS
    if(findExpert(category)){
      // Find Category in Queue and Push User
      queue[category].push(user);
      console.log("QUEUE IN HOME", queue[category]);
    } else {
      queue[category].push(user);
      console.log("DIDNT FIRE", queue[category]);
      // send a message that no experts are available and they are X in line
      io.in(room).emit('message', {message: '*** Experts Busy, Please Wait ***'});
    }
  });

  // RUNS WHEN EXPERT JOINS CHATROOM
  socket.on('joinRoom', function(room, expertId) {
    console.log('Joining Room:', room);
    socket.join(room);
    io.in(room).emit('expert', expertId);
    io.in(room).emit('message', {message: '*** Expert Connected ***'});
  });

  // RUNS WHEN MESSAGE IS SENT BY USER OR EXPERT
  socket.on('message', function(message, room) {
    console.log('New Message:', message, 'in Room:', room);
    io.in(room).emit('message', message);
  });
});

const PORT = process.env.PORT || 2300;
server.listen(PORT, function(req, res) {
  console.log('listening on port: ' + PORT);
});