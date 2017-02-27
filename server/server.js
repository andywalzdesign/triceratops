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
  home: [],
  food: [],
  mensfashion: [],
  womensfashion: [],
  tech: [],
  entertainment: []
};

// TEMPORARY ACTIVE EXPERT LIST (Hardcoded)
let experts = {
  // Expert ID as Prop
  1: {
    userId: undefined,
    categories: ['home']
  }
};

// DETERMINE IF USER CURRENTLY IN QUEUE
app.get('/api/userQueue', function(req, res) {
  if (queue.length) {
    res.send(true);
  } else {
    res.send(false);
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

// RUNS WHEN USER STARTS A SOCKET CONNECTION
io.on('connection', function(socket) {
  console.log('Client Connected:', socket.id);
  socket.emit('id', socket.id);

  // RUNS WHEN USER CREATES CHATROOM
  socket.on('createRoom', function(room, userId) {
    console.log('Joining Room:', room, 'User:', userId);
    socket.join(room);
    var user = {
      id: userId,
      room: room
    };
    queue.push(user);
    console.log('Current Queue:', queue);
    io.in(room).emit('message', {message: '*** Finding Expert ***'});
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