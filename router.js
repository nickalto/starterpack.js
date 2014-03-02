// Module dependencies
var express	= require('express'),
app 		= express(),
config 		= require('./config/config').configure(app),
https	    = require('https'),
http        = require('http'),
passport	= require('passport'),
app_routes 	= require('./backend/routes/application'),
auth_routes	= require('./backend/routes/authentication');

app.get('(/|/login)', app_routes.login);
app.get('/home', auth_routes.isAuthenticated, app_routes.home);
app.get('/create', app_routes.createUser);
app.get('/logout', app_routes.logout);

app.post('/user/create', auth_routes.localAuthentication);	
app.post('/login', passport.authenticate('local', { failureRedirect: '/login', successRedirect: '/home' }));

app.get('/auth/google', passport.authenticate('google', {scope: 'https://www.googleapis.com/auth/plus.login'}));
app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/shityeah', failureRedirect: '/ohno' }));

app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/awwyeah', failureRedirect: '/oops' }));

app.get('/auth/facebook', passport.authenticate('facebook'));
app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/dope', failureRedirect: '/nope' }));

app.get('/auth/github', passport.authenticate('github'));
app.get('/auth/github/callback', passport.authenticate('github', { successRedirect: '/yuuup', failureRedirect: '/broken' }));

// //User Routes
// app.post('/user/read', userRoutes.read);
// app.get('/user/update', isAuthenticated, userRoutes.getUpdate);
// app.post('/user/update', isAuthenticated, userRoutes.update);
// app.post('/user/delete', isAuthenticated, userRoutes.delete);

app.get('*', app_routes.catchall);

http.createServer(app).listen(3000);
https.createServer(app.ssl, app).listen(3001);