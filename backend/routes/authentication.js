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
			console.log('update successful');
			res.redirect('/user/update');
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
	      	 return res.json({ error: { confirm_new_password:'Passwords do not match' } });
            }
	    },
	    function hashPassword(password_match, callback) {
	    	if(password_match) {
		    	auth.hashPassword(req.body.new_password, callback);
		    } else {
		       return res.json({ error: { old_password:'Incorrect password' } });
		    }
	    },
	    function updatePassword(hashed_password, callback) {
			user.updateAttributes({ password: hashed_password })
			.success(function() {
				console.log('password update successful ' + req.body.new_password);
				res.redirect('/user/update');
			})
	    }
	  ]);

	}
};

exports.localDelete = function(req, res) {
	var user = req.user;
	if(user) {
		user.destroy()
		.success(function() {
			console.log('destroy sucessful');
			req.logout();
			res.redirect('/');
		})
	}
}


exports.localAuthentication = passport.authenticate('local', { 
	failureRedirect: '/login', 
	successRedirect: '/home' 
});

//google authentication
exports.googleAuthentication = passport.authenticate('google');

exports.googleCallback = passport.authenticate('google', { 
	successRedirect: '/home?googlesuccess', 
	failureRedirect: '/login?googlefailure' 
});

//twitter authentication
exports.twitterAuthentication = passport.authenticate('twitter');

exports.twitterCallback = passport.authenticate('twitter', { 
	successRedirect: '/home?twittersuccess',
	failureRedirect: '/login?twitterfailure' 
});

//facebook authentication
exports.facebookAuthentication = passport.authenticate('facebook');

exports.facebookCallback = passport.authenticate('facebook', { 
	successRedirect: '/home?facebooksuccess', 
	failureRedirect: '/login?facebookfailure' 
});

//github authentication
exports.githubAuthentication = passport.authenticate('github');

exports.githubCallback = passport.authenticate('github', { 
	successRedirect: '/home?githubsuccess',
	failureRedirect: '/login?githubfailure'
});