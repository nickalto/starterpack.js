var dirname = process.env.PWD;

exports.home = function(req, res) {
	res.render('home', {
    title: 'Home', 
    styles: [],
    nav_class: 'navbar-home',
    nav_links: [
    	{ title: 'Update User', href: '/user/update'},
		{ title: 'Logout', href: '/logout'}
    ]
  });
};

exports.login = function(req, res) {
	res.render('login', {
    	title: 'Login', 
	    styles: [
	    	{css: '../frontend/css/login/login.css'}
	    ],
    	nav_links: [
    		{ title: 'Create User', href: '/create'},
    	]
  	});
};

exports.createUser = function(req, res) {
	res.render('create', {
    	title: 'Create User', 
	    styles: [
	    	{css: '../frontend/css/login/login.css'}
	    ],
	    coffeescript: [
	    	{js: '../frontend/js/controllers/postHelper.js'}
	    ],
    	nav_links: [
    		{ title: 'Login', href: '/login'},
    	]
  	});
};

exports.logout = function(req, res) {
	req.logout();
	res.redirect('/');
};

exports.catchall = function(req, res) {
	res.render('404', {
    	title: '404', 
	    hide_navbar:true
  	});
};



