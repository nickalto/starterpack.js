var dirname = process.env.PWD;

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
	req.logout();
	res.redirect('/');
};

exports.catchall = function(req, res) {
	res.sendfile(dirname + '/frontend/html/404.html');
};



