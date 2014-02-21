var path 		= require('path'),
express 		= require('express'),
db				= require('../db/sql'),
dirname 		= process.env.PWD;

exports.localAuthentication = function (req, res, next) {
	if (req.session && req.session.user_id) {
		next();
	} else {	
		console.log(dirname);
		res.sendfile(dirname + '/frontend/html/login.html');
  	}
};


