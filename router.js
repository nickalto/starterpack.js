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

//local authentication routes
app.post('/user/create', auth_routes.localCreate);	
app.post('/user/delete', auth_routes.localDelete);
app.post('/user/update', auth_routes.localUpdate);
app.post('/user/password', auth_routes.localPasswordUpdate);
app.post('/login', auth_routes.localAuthentication);

//social authentication routes
app.get('/auth/google', auth_routes.googleAuthentication);
app.get('/google/unlink', auth_routes.isAuthenticated, auth_routes.googleUnlink);
app.get('/auth/google/callback', auth_routes.googleCallback);
app.get('/auth/twitter', auth_routes.twitterAuthentication);
app.get('/twitter/unlink', auth_routes.isAuthenticated, auth_routes.twitterUnlink);
app.get('/auth/twitter/callback', auth_routes.twitterCallback);
app.get('/auth/facebook', auth_routes.facebookAuthentication);
app.get('/facebook/unlink', auth_routes.isAuthenticated, auth_routes.facebookUnlink);
app.get('/auth/facebook/callback', auth_routes.facebookCallback);
app.get('/auth/github', auth_routes.githubAuthentication);
app.get('/github/unlink', auth_routes.isAuthenticated, auth_routes.githubUnlink);
app.get('/auth/github/callback', auth_routes.githubCallback);

// 404 catchall
app.use( app_routes.catchall);

http.createServer(app).listen(3000);

/* //Uncomment for SSL
https.createServer(app.ssl, app).listen(3001);
*/