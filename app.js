/**
 * Module dependencies.
 */

var express = require('express');
var http = require('http');
var path = require('path');
var fs = require('fs');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');

// get evironment and corresponding configs
var env = process.env.NODE_ENV || 'development';
var config = require('./config/config')[env];

// connect to MongoDB
mongoose.connect(config.db);

// require all models
var modelsDir = path.join(__dirname, '/app/models');
fs.readdirSync(modelsDir).forEach(function (file) {
	if (~file.indexOf('.js')) require(modelsDir + '/' + file);
});

// require passport config
require('./config/passport')(passport, config);

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', config.root + '/app/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'keyboard cat' }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.methodOverride());
app.use(express.session());
app.use(app.router);
app.use(express.static(config.root + '/public'));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.use(function(req, res, next){
  res.status(404);
  if (req.accepts('html')) {
    res.render('404', { url: req.url });
    return;
  }
  if (req.accepts('json')) {
    res.send({ error: 'Not found' });
    return;
  }
  res.type('txt').send('Not found');
});

require('./config/routes')(app, passport);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
