const LocalStrategy = require('passport-local').Strategy;
const User = require('../model/User');
const config = require('../config/database');
const bcrypt = require('bcryptjs');

module.exports = function (passport) {
	//local Strategy
	passport.use(new LocalStrategy(
		{ usernameField: 'email' }, 
		function (email, password, done) {
		// match email
		let query = {
			email: email,
		};
		User.findOne(query, function (err, user) {
			if (err) {
				throw err;
			}
			if (!user) {
				return done(null, false, {
					message: 'No User Found'
				});
			}
			bcrypt.compare(password, user.password, function (err, isMatch) {
				if (err) throw err;
				if (isMatch) {
					return done(null, user);
				} else {
					return done(null, false, {
						message: 'Email or Password Incorrect'
					})
				}
			});
		});
	}));
	passport.serializeUser(function (user, done) {
		done(null, user.id);
	});

	passport.deserializeUser(function (id, done) {
		User.findById(id, function (err, user) {
			done(err, user);
		});
	});
}