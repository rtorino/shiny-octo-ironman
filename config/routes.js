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
	app.post('/signup', Auth.userExist, users.postUserCreate);
	app.get('/signin', users.getUserLogin);
	app.post('/signin' 
		, passport.authenticate('local', {
			failureRedirect: '/signin',
			failureFlash: true
		})
		, users.session
	);
	app.get('/users/:userId', users.showProfile);
	app.post('/users/update', users.updateProfile);
	app.get('/logout', users.logout);

	app.param('userId', users.user);
};