var dirname = process.env.PWD;

exports.home = function(req, res) {
	res.render('Home', {
    title: 'Home', 
    styles: [],
    nav_class: 'navbar-home',
    nav_links: [
    	{ title: 'Setup', href: '/setup'},
    	{ title: 'Update User', href: '/user/update'},
		{ title: 'Logout', href: '/logout'}
    ]
  });
};


exports.setup = function(req, res) {
	res.render('Setup', {
    title: 'Setup', 
    styles: [],
    nav_class: 'navbar-setup',
    nav_links: [
    	{ title: 'Home', href: '/home'},
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

exports.updateUser = function(req, res) {
  res.render('update', {
      title: 'Update User', 
      styles: [
        {css: '../frontend/css/login/login.css'}
      ],
      nav_links: [
        { title: 'Home', href: '/home'},
        { title: 'Setup', href: '/setup'},
        { title: 'Logout', href: '/logout'}      
      ],
      user: req.user
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



