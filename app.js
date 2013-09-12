/**
 * Module dependencies.
 */
var express = require('express')
var MemoryStore = express.session.MemoryStore
var mongoStore = require('connect-mongo')(express)
var path = require('path')
var fs = require('fs')
var _ = require('underscore')
var mongoose = require('mongoose')
var passport = require('passport')
var http = require('http')
var socketio = require('socket.io')
var passportSocketIo = require('passport.socketio')

// Load configurations
var env = process.env.NODE_ENV || 'development'
var config = require('./config/config')[env]

// Bootstrap db connection
mongoose.connect(config.db)

// Bootstrap models
var modelsDir = path.join(__dirname, '/app/models')
fs.readdirSync(modelsDir).forEach(function (file) {
	if (~file.indexOf('.js')) require(modelsDir + '/' + file)
})

// Bootstrap passport config
require('./config/passport')(passport, config)

var app = express()
var store = new mongoStore({ url : config.db, collection : 'sessions' });
//var store = new MemoryStore()
// express settings
require('./config/express')(app, config, passport, store)

// Bootstrap routes
require('./config/routes')(app, passport)

var server = http.createServer(app)
var sio = socketio.listen(server)

var clients = {}
var socketsOfClients = {}

sio.configure(function () {
  sio.set('authorization', passportSocketIo.authorize({
    cookieParser: express.cookieParser, //or connect.cookieParser
    key: 'express.sid',                 //the cookie where express (or connect) stores the session id.
    secret: 'dirty',                    //the session secret to parse the cookie
    store: store,                       //the session store that express uses
    fail: function (data, accept) {     // *optional* callbacks on success or fail
      accept(null, false)               // second parameter takes boolean on whether or not to allow handshake
    },
    success: function (data, accept) {
      accept(null, true)
    }
  }))
})

// upon connection, start a periodic task that emits (every 1s) the current timestamp
sio.sockets.on('connection', function (socket) {
  var username = socket.handshake.user.username;

  clients[username] = socket.id
  socketsOfClients[socket.id] = username
  userNameAvailable(socket.id, username)
  userJoined(username)

  socket.on('data', function (data) {
    socket.broadcast.emit('data', { 'drawing' : data })
  })

  socket.on('message', function (data) {
    var now = new Date();
    sio.sockets.emit('message', {
      'source': socketsOfClients[socket.id],
      'time': now.getHours() + ':' + now.getMinutes() + ':' + now.getSeconds(), 
      'message': data.message
    })
  })

  socket.on('disconnect', function() {
    var username = socketsOfClients[socket.id]
    delete socketsOfClients[socket.id]
    delete clients[username];
    // relay this message to all the clients
    userLeft(username)
  })
})

// Start the application by listening on port <>
var port = process.env.PORT || 3000
server.listen(port, function(){
  console.log('Express server listening on port ' + port)
});

function userNameAvailable(socketId, username) {
  setTimeout(function(){ 
    sio.sockets.sockets[socketId].emit('user welcome', {
     "currentUsers": JSON.stringify(Object.keys(clients))
    });
  }, 500);
}

function userJoined(username) {
  Object.keys(socketsOfClients).forEach(function(socketId) {
    sio.sockets.sockets[socketId].emit('user joined', {
      "username": username
    });
  });
}

function userLeft(username) {
  sio.sockets.emit('user left', {
    "username": username
  });
}

// expose app
exports = module.exports = app;
