/**
 * Module Dependencies
 */

var users = require('../app/controllers/users');
var home = require('../app/controllers/home');
var Auth = require('./middlewares/authorization');

module.exports = function (app, passport) {
	// user routes
	app.get('/signup', users.getUserCreate);
	app.post('/signup', Auth.userExist, users.postUserCreate);
	app.get('/login', users.getUserLogin);
	app.post('/login' 
		, passport.authenticate('local', {
			successRedirect : '/',
			failureRedirect : '/login',
		})
	);

	app.get('/', home.index); 
	app.post('/logout', users.logout);
};