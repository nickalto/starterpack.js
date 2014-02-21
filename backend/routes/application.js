var path 	= require('path'),
express 	= require('express'),
hbs 		= require("hbs"),
dirname 	= process.env.PWD;

exports.home = function(req, res) {
	res.sendfile(dirname + '/frontend/html/home.html');
};

exports.login = function(req, res) {
	res.sendfile(dirname + '/frontend/html/login.html');
};

exports.createUser = function(req, res) {
	res.sendfile(dirname + '/frontend/html/create.html');
};

exports.logout = function(req, res) {
	req.session.user_id = null;
	//passport logout
	req.logout();
	res.redirect('/');
};

exports.catchall = function(req, res) {
	res.sendfile(dirname + '/frontend/html/404.html');
};

exports.reset = function(req, res) {
	db.delete();
	db.initialize();
	res.send('reset db');
};

exports.isAuthenticated = function (req, res, next) {
	if (req.session.user_id) {
		next();
	} else {	
		console.log(dirname);
		res.sendfile(dirname + '/frontend/html/login.html');
  	}
};

