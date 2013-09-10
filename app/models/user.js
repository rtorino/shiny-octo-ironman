/**
 * Module dependencies
 */

var mongoose = require('mongoose')
var pass = require('pwd')

UserSchema = new mongoose.Schema({
	firstname: 	String,
	lastname: 	String,
	username: 	String,
	email: 			String,
	salt: 			String,
	hash: 			String
});	

// validate UserSchema fields
UserSchema.path('username').validate(function (username) {
	return username.length
}, 'Username cannot be blank')

UserSchema.path('username').validate(function (username, fn) {
  var User = mongoose.model('User')
  
  // Check only when it is a new user or when username field is modified
  if (this.isNew || this.isModified('username')) {
    User.find({ username: username }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Username already exists')

UserSchema.path('email').validate(function (email) {
	return email.length
}, 'Email cannot be blank')

UserSchema.path('email').validate(function (email, fn) {
  var User = mongoose.model('User')
  
  // Check only when it is a new user or when email field is modified
  if (this.isNew || this.isModified('email')) {
    User.find({ email: email }).exec(function (err, users) {
      fn(!err && users.length === 0)
    })
  } else fn(true)
}, 'Email already exists')

UserSchema.path('hash').validate(function (hash) {
	return hash.length
}, 'Password cannot be blank')

UserSchema.statics.signup = function (username, email, password, done) {
	var User = this;
	pass.hash(password, function (err, salt, hash) {
		if (err) return done(err, null)

		User.create({
			username: username,
			email: email,
			salt: salt,
			hash: hash
		}, function (err, user) {
			if (err) return done(err, null)

			return done(null, user)
		})
	})
}

UserSchema.statics.update = function (req, done) {
	this.findByIdAndUpdate(req.session.passport.user,
		{	'firstname': req.body.firstname, 'lastname': req.body.lastname, 'email': req.body.email }, 
		{}, function (err, updated) {
			if (err) return done(err)

			return done(null, updated)
		});
};


UserSchema.statics.isValidUserPassword = function (username, password, done) {
	this.findOne({ username : username }, function (err, user) {
		if (err) return done(err)
		
		if (!user) {
			return done(null, false, { message : 'Unknown user.' })
		}

		pass.hash(password, user.salt, function (err, hash) {
			if (err) return done(err)

			if (hash == user.hash) {
				return done(null, user)
			} else {
				return done(null, false, { message : 'Invalid password.' })
			}
		})
	})
}

User = mongoose.model('User', UserSchema)
module.exports = User