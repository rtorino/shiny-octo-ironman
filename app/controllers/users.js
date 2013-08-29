/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var User = mongoose.model('User');
var utils = require('../../lib/utils');

/**
 * Show sign up form
 */
exports.getUserCreate = function (req, res) {
	res.render('users/signup', {
		title: 'Sign up',
		user: null
	});
};

/**
 * Create user
 */
exports.postUserCreate = function (req, res, next) {
	console.log(req.body);
	User.signup(req.body.email, req.body.password, function (err, user) {
		if (err) throw err;

		req.login(user, function (err) {
			if (err) return next(err);

			return res.redirect('/');
		});
	});
};

/**
 * Show login form
 */
exports.getUserLogin = function (req, res) {
	res.render('users/login', {
		title: 'Log in',
		user: null
	});
};

/**
 * Logout user
 */
exports.logout = function (req, res) {
	req.logout();
	res.redirect('/');
};




