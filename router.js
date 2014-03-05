// Module dependencies
var express	= require('express'),
app 		= express(),
config 		= require('./config/config').configure(app),
https	    = require('https'),
http        = require('http'),
app_routes 	= require('./backend/routes/application'),
auth_routes	= require('./backend/routes/authentication');

app.get('(/|/login)', app_routes.login);
app.get('/home', auth_routes.isAuthenticated, app_routes.home);
app.get('/setup', auth_routes.isAuthenticated, app_routes.setup);
app.get('/create', app_routes.createUser);
app.get('/user/update', auth_routes.isAuthenticated, app_routes.updateUser);
app.get('/logout', app_routes.logout);

//authentication Routes
app.post('/user/create', auth_routes.localCreate);	
app.post('/login', auth_routes.localAuthentication);

app.get('/auth/google', auth_routes.googleAuthentication);
app.get('/auth/google/callback', auth_routes.googleCallback);
app.get('/auth/twitter', auth_routes.twitterAuthentication);
app.get('/auth/twitter/callback', auth_routes.twitterCallback);
app.get('/auth/facebook', auth_routes.facebookAuthentication);
app.get('/auth/facebook/callback', auth_routes.facebookCallback);
app.get('/auth/github', auth_routes.githubAuthentication);
app.get('/auth/github/callback', auth_routes.githubCallback);

// //User Routes
// app.post('/user/read', userRoutes.read);
// app.get('/user/update', isAuthenticated, userRoutes.getUpdate);
// app.post('/user/update', isAuthenticated, userRoutes.update);
// app.post('/user/delete', isAuthenticated, userRoutes.delete);

app.use( app_routes.catchall);

http.createServer(app).listen(3000);
https.createServer(app.ssl, app).listen(3001);