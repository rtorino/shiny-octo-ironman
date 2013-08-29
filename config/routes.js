/**
 * Module Dependencies
 */

var User = require('../models/user');
var Auth = require('./middlewares/authorization');

module.exports = function (app, passport) {
	app.get('/', function (req, res){ 
		if(req.isAuthenticated()){
		  res.render('home', { user : req.user }); 
		}else{
			res.render('home', { user : null });
		}
	});

	app.get('/login', function(req, res){ 
		res.render('login');
	});

	app.post('/login' 
		, passport.authenticate('local', {
			successRedirect : '/',
			failureRedirect : '/login',
		})
	);

	app.get('/signup', function (req, res) {
		res.render('signup');
	});

	app.post('/signup', Auth.userExist, function (req, res, next) {
		User.signup(req.body.email, req.body.password, function (err, user) {
			if (err) throw err;
			
			req.login(user, function (err) {
				if (err) return next(err);
			
				return res.redirect('/');
			});
		});
	});	
};