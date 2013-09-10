/**
 * Module dependencies
 */

var mongoose = require('mongoose')
var User = mongoose.model('User')
var utils = require('../../lib/utils')

/**
 * Show sign up form
 */
exports.getUserCreate = function (req, res) {
	res.render('users/signup', {
		title: 'Sign up',
		info: req.flash('info'),
		user: new User()
	})
}

/**
 * Create user
 */
exports.postUserCreate = function (req, res, next) {
	User.signup(req.body.username, req.body.email, req.body.password, function (err, user) {
		if (err) {
			if (typeof err.errors === 'object') {
				err = utils.errors(err.errors)	
			} else {
				err = err.message
			}

			return res.render('users/signup', {
      	errors: err,
      	user: user,
      	title: 'Sign up'
  		})
		}

		// login user automatically after sign up  
		req.login(user, function (err) {
			if (err) return next(err);

			return res.redirect('/');
		})
	})
}

/**
 * Session 
 */
exports.session = function (req, res) {
	if (req.session.returnTo) {
		res.redirect(req.session.returnTo)
		delete req.session.returnTo
	} else {
		res.redirect('/')
	}
}

/**
 * Show login form
 */
exports.getUserLogin = function (req, res) {
	res.render('users/login', {
		title: 'Log in',
		errors: req.flash('error')
	})
}

/**
 * Logout user
 */
exports.logout = function (req, res) {
	req.logout()
	res.redirect('/')
}

/**
 * Show user profile
 */
exports.show = function (req, res) {
	var user = req.profile;
	res.render('users/profile', {
		title: 'Profile',
		user: user
	})
}

/**
 * Update user profile
 */
exports.update = function (req, res, next) {
	User.update(req, function (err, updated) {
		if (err) {
		  return res.render('users/profile', {
      	errors: utils.errors(err.errors),
      	user: user,
      	title: 'Profile'
  		})
		} else {
			res.redirect('/');
		}
	})
}

/**
 * Find user by id
 */ 
 exports.user = function (req, res, next, id) {
 	User
 		.findOne({ _id : id })
 		.exec(function (err, user) {
 			if (err) return next(err)
 			if (!user) return (new Error('Failed to load User' + id))
			req.profile = user
			next() 			
 		})
 }




