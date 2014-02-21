var path 	= require('path'),
express 	= require('express'),
db			= require('../backend/db/sql'),
hbs 		= require("hbs"),
fs		    = require('fs'),
passport	= require('passport'),
dirname 	= process.env.PWD;


var configureSSL = function(app) {
	//SSL setup
	console.log(__dirname);
	app.ssl = {
	  key: fs.readFileSync(__dirname + '/ssl/privatekey.pem').toString(),
	  cert: fs.readFileSync(__dirname + '/ssl/certificate.pem').toString()
	};
};

var configureHandlebars = function(app) {
    hbs.registerPartials(__dirname + '/frontend/html/partials');

	hbs.handlebars.registerHelper('json', function(context) {
	    return JSON.stringify(context);
	});

};


exports.configure = function (app) {
	app.configure(function() {
		app.use(express.json());
		app.use(express.cookieParser('fdk;133jna;l12jj3k'));
		app.use(express.static(dirname + '/')); 
		app.use(express.urlencoded());
		app.use(passport.initialize());
		app.use(passport.session());
		app.set('view engine', 'html');
		app.set('views', dirname + '/html/');
		app.engine('html', hbs.__express);
	});

	// Configurations
	configureSSL(app);
	configureHandlebars(app);
	db.initialize();
};
