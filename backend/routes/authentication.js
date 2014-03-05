var auth = require('../passport/passport'),
passport = require('passport');

exports.isAuthenticated = function(req, res, next) {
  if (req.user) return next();
  res.redirect('/login');
};

//local authentication
exports.localCreate = function(req, res) {
	auth.localAuthentication(req, res);
};

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