/**
 * Module dependencies
 */

var mongoose = require('mongoose');
var hash = require('../util/hash');

UserSchema = mongoose.Schema({
	firstName: 	String,
	lastName: 	String,
	email: 			String,
	salt: 			String,
	hash: 			String
});	

UserSchema.statics.signup = function (email, password, done) {
	var User = this;
	hash(password, function (err, salt, hash) {
		if (err) throw err;

		User.create({
			email : email,
			salt : salt,
			hash : hash
		}, function (err, user) {
			if (err) throw err;

			done(null, user);
		});
	});
};

UserSchema.statics.isValidUserPassword = function (email, password, done) {
	this.findOne({ email : email }, function (err, user) {
		if (err) return done(err);

		if (!user) {
			return done(null, false, { message : 'Incorrect email.' });
		}

		hash(password, user.salt, function (err, hash) {
			if (err) return done(err);

			if (hash == user.hash) {
				return done(null, user);
			} else {
				done(null, false, { message : 'Incorrect password.' });
			}
		});
	});
};

User = mongoose.model('User', UserSchema);
module.exports = User;