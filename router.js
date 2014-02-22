// Module dependencies
var express	= require('express'),
app 		= express(),
https	    = require('https'),
http        = require('http'),
app_routes 	= require('./backend/routes/application'),
auth_routes	= require('./backend/routes/authentication'),
config 		= require('./config/config').configure(app);

app.get('(/|/login)', app_routes.login);
app.get('/home', app_routes.home);
app.get('/create', app_routes.createUser);
app.get('/logout', app_routes.logout);
app.get('/reset', app_routes.reset);

// //User Routes
// app.post('/user/create', userRoutes.create);
// app.post('/user/read', userRoutes.read);
// app.get('/user/update', isAuthenticated, userRoutes.getUpdate);
// app.post('/user/update', isAuthenticated, userRoutes.update);
// app.post('/user/delete', isAuthenticated, userRoutes.delete);

app.get('*', app_routes.catchall);

http.createServer(app).listen(3000);
https.createServer(app.ssl, app).listen(3001);