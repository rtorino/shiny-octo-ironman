/**
 * Module Dependencies
 */

var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;
var User = mongoose.model('User');

module.exports = function (passport, config) {
	// serialize sessions
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findOne({ _id : id }, function (err, user) {
			done(err, user);
		});
	});

	// use local strategy
	passport.use(new LocalStrategy({
		usernameField : 'username',
		passwordField : 'password'
	}, function (username, password, done) {
		User.isValidUserPassword(username, password, done);
	}));
};