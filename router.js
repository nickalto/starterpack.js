// Module dependencies
var express	= require('express'),
https	    = require('https'),
http        = require('http');

//include routes
var appRoutes 	= require('./backend/routes/application');
var authRoutes	= require('./backend/routes/authentication');

var app = express();
var appConfig = require('./config/config');
appConfig.configure(app);

app.get('(/|/login)', appRoutes.login);
app.get('/home', appRoutes.home);
app.get('/create', appRoutes.createUser);
app.get('/logout', appRoutes.logout);
app.get('/reset', appRoutes.reset);

// //User Routes
// app.post('/user/create', userRoutes.create);
// app.post('/user/read', userRoutes.read);
// app.get('/user/update', isAuthenticated, userRoutes.getUpdate);
// app.post('/user/update', isAuthenticated, userRoutes.update);
// app.post('/user/delete', isAuthenticated, userRoutes.delete);

app.get('*', appRoutes.catchall);


http.createServer(app).listen(3000);
https.createServer(app.ssl, app).listen(3001);