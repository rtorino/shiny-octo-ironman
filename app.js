/**
 * Module dependencies.
 */
//http://stackoverflow.com/questions/13095418/how-to-use-passport-with-express-and-socket-io
//http://stackoverflow.com/questions/15093018/sessions-with-express-js-passport-js
var express = require('express');
var MemoryStore = express.session.MemoryStore;
var mongoStore = require('connect-mongo')(express);
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var http = require('http');
var socketio = require('socket.io');
var passportSocketIo = require('passport.socketio');

// Load configurations
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

// Bootstrap db connection
mongoose.connect(config.db);

// Bootstrap models
var modelsDir = path.join(__dirname, '/app/models');
fs.readdirSync(modelsDir).forEach(function (file) {
	if (~file.indexOf('.js')) require(modelsDir + '/' + file);
});

// Bootstrap passport config
require('./config/passport')(passport, config);

var app = express();
//var store = new mongoStore({ url : config.db, collection : 'sessions' });
var store = new MemoryStore();
// express settings
require('./config/express')(app, config, passport, store);

// Bootstrap routes
require('./config/routes')(app, passport);

// Start the application by listening on port <>
var port = process.env.PORT || 3000;
var server = http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});

var sio = socketio.listen(server);

var clients = {};
var socketsOfClients = {};

sio.configure(function () {
  sio.set('authorization', passportSocketIo.authorize({
    cookieParser: express.cookieParser,  //or connect.cookieParser
    key: 'express.sid',                  //the cookie where express (or connect) stores the session id.
    secret: 'dirty',                     //the session secret to parse the cookie
    store: store,                        //the session store that express uses
    fail: function (data, accept) {      // *optional* callbacks on success or fail
      accept(null, false);               // second parameter takes boolean on whether or not to allow handshake
    },
    success: function (data, accept) {
      accept(null, true);
    }
  }));
});

// upon connection, start a periodic task that emits (every 1s) the current timestamp
sio.sockets.on('connection', function (socket) {
  console.log('user connected');
  var sender = setInterval(function () {
    socket.emit('data', new Date().getTime());
  }, 1000);

  socket.on('disconnect', function() {
    clearInterval(sender);
  });
});

/*sio.sockets.on('connection', function(socket) {
  socket.on('set username', function(userName) {
    // Is this an existing user name?
    if (clients[userName] == undefined) {
      // Does not exist ... so, proceed
      clients[userName] = socket.id;
      socketsOfClients[socket.id] = userName;
      userNameAvailable(socket.id, userName);
      userJoined(userName);
    } else if (clients[userName] === socket.id) {
      // Ignore for now
    } else {
      userNameAlreadyInUse(socket.id, userName);
    }
  });

  socket.on('message', function(msg) {
    var srcUser;
    if (msg.inferSrcUser) {
      // Infer user name based on the socket id
      srcUser = socketsOfClients[socket.id];
    } else {
      srcUser = msg.source;
    }
    if (msg.target == "All") {
      // broadcast
      sio.sockets.emit('message', {
        "source": srcUser,
        "message": msg.message,
        "target": msg.target
      });
    } else {
      // Look up the socket id
      sio.sockets.sockets[clients[msg.target]].emit('message', {
        "source": srcUser,
        "message": msg.message,
        "target": msg.target   
      });
    }
  });

  socket.on('disconnect', function() {
    var uName = socketsOfClients[socket.id];
    delete socketsOfClients[socket.id];
    delete clients[uName];
    // relay this message to all the clients
    userLeft(uName);
  });
});*/

function userJoined(uName) {
  Object.keys(socketsOfClients).forEach(function(sId) {
    sio.sockets.sockets[sId].emit('userJoined', {
      "userName": uName
    });
  });
}

function userLeft(uName) {
  sio.sockets.emit('userLeft', {
    "userName": uName
  });
}

function userNameAvailable(sId, uName) {
  setTimeout(function(){ 
    console.log('Sending welcome msg to' + uName + ' at ' + sId);

    sio.sockets.sockets[sId].emit('welcome', {
      "userName": uName, 
      "currentUsers": JSON.stringify(Object.keys(clients))
    });
  }, 500);
}

function userNameAlreadyInUse(sId, uName) {
  setTimeout(function() {
    sio.sockets.sockets[sId].emit('error', {"userNameInUse": true});
  }, 500);
}

// expose app
exports = module.exports = app;
