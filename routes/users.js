const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require('passport');

// Bringing in the Article modile connect
let User = require("../model/User");

// User Registration Form route
router.get("/register", function (req, res) {
	res.render("register", {
		title: "Register",
	});
});

// User Registration route
router.post("/register", [
	body("name", "Name is Required").trim().escape().not().isEmpty(),
	body("username", "Name is Required").trim().escape().not().isEmpty(),
	body("email", "Your email is Required").trim().escape().not().isEmpty(),
	body("email", "Your email is not valid").trim().escape().isEmail().normalizeEmail(),
	body("password", "password is required").trim().escape().not().isEmpty().isLength({
		min: 5
	}).withMessage("Your password must be at least 5 characters"),
	body("password2", "").trim().escape().not().isEmpty().custom((value, {
		req
	}) => {
		if (value === req.body.password) {
			return value;
		} else {
			throw new Error("Passwords don't match");
		}
	})
], function (req, res) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		res.render("register", {
			title: "Register",
			errors: errors.array(),
		});
	} else {
		let newUser = new User({
			name : req.body.name,
			username : req.body.username,
			email : req.body.email,
			password : req.body.password,
		});
		bcrypt.genSalt(10, function(err, salt){
			bcrypt.hash(newUser.password,salt, function(err, hash){
				if(err){
					console.log(err);
				}else{
					newUser.password = hash;
					newUser.save(function (err) {
						if (err) {
							console.log(err);
							return;
						} else {
							req.flash("success", "User Registered And Can Login");
							res.redirect("/users/login");
						}
					});
				}
			});
		});
	}
});

// User Login Form route
router.get("/login", function (req, res) {
	res.render("login", {
		title: "Login",
	});
});

// User Login route
router.post("/login", function (req, res, next) {
	passport.authenticate('local',{
		successRedirect:'/',
		failureRedirect:'/users/login',
		failureFlash:true,
	})(req, res, next);
});

//  User Login Form route
router.get("/logout", function (req, res) {
	req.logout();
	req.flash('success', 'you are logged out');
	res.redirect('/users/login');
});


module.exports = router;