// Module dependencies
var express	= require('express'),
app 		= express(),
config 		= require('./config/config').configure(app),
https	    = require('https'),
http        = require('http'),
auth = require('./backend/passport/passport'),
passport	= require('passport'),
app_routes 	= require('./backend/routes/application'),
auth_routes	= require('./backend/routes/authentication');

app.get('(/|/login)', app_routes.login);
app.get('/home', app_routes.home);
app.get('/create', app_routes.createUser);
app.get('/logout', app_routes.logout);
app.get('/reset', app_routes.reset);

//app.get('/user/read', auth.isAuthenticated, app_routes.home);
app.post('/user/create', auth_routes.localCreate);	
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/home');
  });

// //User Routes
// app.post('/user/read', userRoutes.read);
// app.get('/user/update', isAuthenticated, userRoutes.getUpdate);
// app.post('/user/update', isAuthenticated, userRoutes.update);
// app.post('/user/delete', isAuthenticated, userRoutes.delete);

app.get('*', app_routes.catchall);

http.createServer(app).listen(3000);
https.createServer(app.ssl, app).listen(3001);