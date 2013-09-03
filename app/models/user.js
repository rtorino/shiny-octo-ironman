/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var pass = require('pwd');

UserSchema = new mongoose.Schema({
	firstname: 	String,
	lastname: 	String,
	username: 	String,
	email: 			String,
	salt: 			String,
	hash: 			String
});	

UserSchema.statics.signup = function (username, email, password, done) {
	var User = this;
	pass.hash(password, function (err, salt, hash) {
		if (err) throw err;

		User.create({
			username: username,
			email: email,
			salt: salt,
			hash: hash
		}, function (err, user) {
			if (err) throw err;

			done(null, user);
		});
	});
};

UserSchema.statics.update = function (req, done) {
	this.update({ _id: req.session.passport.user },
		{	$set: req.body }, 
		{ multi: true }, function (err, updated) {
			if (err) throw err;

			done(null, updated);
		});
};


UserSchema.statics.isValidUserPassword = function (username, password, done) {
	this.findOne({ username : username }, function (err, user) {
		if (err) return done(err);
		
		if (!user) {
			return done(null, false, { message : 'Unknown user.' });
		}

		pass.hash(password, user.salt, function (err, hash) {
			if (err) return done(err);

			if (hash == user.hash) {
				return done(null, user);
			} else {
				return done(null, false, { message : 'Invalid password.' });
			}
		});
	});
};

User = mongoose.model('User', UserSchema);
module.exports = User;