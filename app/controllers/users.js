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
		info: req.flash('info'),
		user: null
	});
};

/**
 * Create user
 */
exports.postUserCreate = function (req, res, next) {
	User.signup(req.body.email, req.body.password, function (err, user) {
		if (err) throw err;

		req.login(user, function (err) {
			if (err) return next(err);

			return res.redirect('/');
		});
	});
};

/**
 * Session 
 */
exports.session = function (req, res) {
	if (req.session.returnTo) {
		res.redirect(req.session.returnTo);
		delete req.session.returnTo;
	} else {
		res.redirect('/');
	}
};

/**
 * Show login form
 */
exports.getUserLogin = function (req, res) {
	res.render('users/login', {
		title: 'Log in',
		errors: req.flash('error'),
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




