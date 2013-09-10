/**
 * Module Dependencies
 */

var users = require('../app/controllers/users');
var home = require('../app/controllers/home');
var Auth = require('./middlewares/authorization');

module.exports = function (app, passport) {
	// public route
	app.get('/', home.index); 

	// user routes
	app.get('/signup', users.getUserCreate);
	app.post('/signup', users.postUserCreate);
	app.get('/signin', users.getUserLogin);
	app.post('/signin' 
		, passport.authenticate('local', {
			failureRedirect: '/signin',
			failureFlash: true
		})
		, users.session
	);
	app.get('/users/:id', Auth.isAuthenticated, users.show);
	app.post('/users/:id', Auth.isAuthenticated, users.update);
	app.get('/logout', users.logout);

	app.param('id', users.user);
};