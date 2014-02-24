var auth = require('../passport/passport'),
passport = require('passport');

exports.localCreate = function(req, res) {
	auth.localAuthentication(req, res);
};
