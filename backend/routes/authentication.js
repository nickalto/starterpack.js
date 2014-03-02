var auth = require('../passport/passport'),
passport = require('passport');

exports.localCreate = function(req, res) {
	auth.localAuthentication(req, res);
};

exports.localAuthentication = function(req, res) {
	auth.localAuthentication(req, res);
}

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};