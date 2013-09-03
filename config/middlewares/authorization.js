var User = require('../../app/models/user');

/**
 * Generic require login middleware 
 */
exports.isAuthenticated = function (req, res, next) {
	if (!req.isAuthenticated()) {
		req.session.returnTo = req.originalUrl;
    return res.redirect('/login');	
	} 
	next();	
};

exports.userExist = function (req, res, next) {
	User.count({ email : req.body.email }, function (err, count) {
		if (count === 0) {
			next();
		} else {
			req.flash('info', 'Email already exists.');
			res.redirect('/signup');
		}
	});
};