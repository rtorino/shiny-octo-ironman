/**
 * Module dependencies.
 */

var express = require('express');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var http = require('http');

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
// express settings
require('./config/express')(app, config, passport);

// Bootstrap routes
require('./config/routes')(app, passport);

// Start the application by listening on port <>
var port = process.env.PORT || 3000;
http.createServer(app).listen(port, function(){
  console.log('Express server listening on port ' + port);
});

// expose app
exports = module.exports = app;
