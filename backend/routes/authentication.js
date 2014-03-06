var auth = require('../passport/passport'),
bcrypt	 = require('bcrypt'),
async	 = require('async'),
passport = require('passport');

exports.isAuthenticated = function(req, res, next) {
  if (req.user) return next();
  res.redirect('/login');
};

//local authentication
exports.localCreate = function(req, res) {
	auth.localAuthentication(req, res);
};

exports.localUpdate = function(req, res) {
	var user = req.user;
	if(user) {
		user.updateAttributes({
			first_name: req.body.first_name,
			last_name: req.body.last_name,
			username: req.body.username,
			email_address: req.body.email_address,
			gender: req.body.gender,
			location: req.body.location,
			picture: req.body.picture
		})
		.success(function() {
			res.json({ redirect: '/user/update'});
		})
		.failure(function(error) {
	       auth.error(res, { generic: 'Error: ' + error });
		})
	}
};

exports.localPasswordUpdate = function(req, res) {
	var user = req.user;
	if(user) {
	 async.waterfall([
	    function validatePassword(callback) {
	    	if(req.body.new_password === req.body.confirm_new_password) { 
		 		bcrypt.compare(req.body.old_password, req.user.password, function(err, password_match) {password_match, 
					callback(null, password_match);
				});
	 		} else {
	      	 auth.error(res, { confirm_new_password:'Passwords do not match' });
            }
	    },
	    function hashPassword(password_match, callback) {
	    	if(password_match) {
		    	auth.hashPassword(req.body.new_password, callback);
		    } else {
		       auth.error(res, { old_password:'Incorrect password' });
		    }
	    },
	    function updatePassword(hashed_password, callback) {
			user.updateAttributes({ password: hashed_password })
			.success(function() {
				console.log('password update successful ' + req.body.new_password);
				res.json({ redirect: '/user/update'})
			})
			.failure(function(error) {
		       auth.error(res, { generic:'Error: ' + error });
			});
	    }
	  ]);

	}
};

exports.localDelete = function(req, res) {
	var user = req.user;
	if(user) {
		user.destroy()
		.success(function() {
			req.logout();
			res.redirect('/');
		})
	}
}

exports.unlink = function(req, res, attributes) {
	var user = req.user;
	user.updateAttributes(attributes)
	.success(function() {
		res.redirect('/user/update');
	})
	.failure(function(error) {
       auth.error(res, { generic:'Error: ' + error });
	});
};

exports.localAuthentication = passport.authenticate('local', { 
	failureRedirect: '/login', 
	successRedirect: '/home' 
});


//google authentication
exports.googleAuthentication = passport.authenticate('google');

exports.googleCallback = passport.authenticate('google', { 
	successRedirect: '/home?success', 
	failureRedirect: '/login?failure' 
});

exports.googleUnlink = function(req, res) {
	exports.unlink( req, res, { 
		google_uid: null,
		google_accesstoken: null,
		google_refreshtoken: null 
	});
};

//twitter authentication
exports.twitterAuthentication = passport.authenticate('twitter');

exports.twitterCallback = passport.authenticate('twitter', { 
	successRedirect: '/home?success',
	failureRedirect: '/login?failure' 
});

exports.twitterUnlink = function(req, res) {
	exports.unlink( req, res, { 
		twitter_uid: null,
		twitter_accesstoken: null,
		twitter_refreshtoken: null 
	});
};

//facebook authentication
exports.facebookAuthentication = passport.authenticate('facebook');

exports.facebookCallback = passport.authenticate('facebook', { 
	successRedirect: '/home?success', 
	failureRedirect: '/login?failure' 
});

exports.facebookUnlink = function(req, res) {
	exports.unlink( req, res, { 
		facebook_uid: null,
		facebook_accesstoken: null,
		facebook_refreshtoken: null 
	});
};

//github authentication
exports.githubAuthentication = passport.authenticate('github');

exports.githubCallback = passport.authenticate('github', { 
	successRedirect: '/home?success',
	failureRedirect: '/login?failure'
});

exports.githubUnlink = function(req, res) {
	exports.unlink( req, res, { 
		github_uid: null,
		github_accesstoken: null,
		github_refreshtoken: null 
	});
};