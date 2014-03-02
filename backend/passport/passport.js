var _             = require('underscore'),
passport          = require('passport'),
bcrypt            = require('bcrypt'),
async             = require('async'),
LocalStrategy     = require('passport-local').Strategy,
GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy,
TwitterStrategy   = require('passport-twitter').Strategy,
FacebookStrategy  = require('passport-facebook').Strategy,
GitHubStrategy    = require('passport-github').Strategy,
secrets           = require('./secrets'),
db                = require('../db/sql'),
User              = db.User;

//Passport serialization
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.find({ where: { id: id } })
  .success(function(user) {
    done(null, user);
  })
  .failure(function(error) {
    done(error, null);
  })
});

// Create a local user
exports.localAuthentication = function(req, res) {
  var password = null;
  async.series({
    validateUsername: function(callback) {
      User.find({ where: { username: req.body.username } })
        .done(function(error, user) {
          if(user) {
            return res.json({ 
              success: false, 
              error: { username:'Username is already being used' } 
            });
          }
          callback();
        });
    },
    hashPassword: function(callback) {
      var plaintext_password = req.body.password;
      bcrypt.hash(plaintext_password, 5, function(err, hashed_password) {
          if(err) {
            return new Error('models/Authentication.js: bcrypt hashing error');
          }
          password = hashed_password;
          callback();
        });
    },
    createUser: function(callback) {
      User.create({ 
        username: req.body.username,
        first_name: req.body.first_name,
        email_address: req.body.email_address,
        last_name: req.body.last_name,
        password: password
      })
      .success(function(user) {
        req.user = user;
        res.json({ success: true, redirect: '/login'});
      })
      .error(function(err) {
        res.json({ success: false, error: err });
      })
    }
  });
};


//Sign in using username and Password.
passport.use(new LocalStrategy( function(username, password, done) {
  var user = null;
  async.series({
    findUser: function(callback) {
      User.find({ where: { username: username } })
      .success(function(foundUser) {
        user = foundUser;
        callback();
      });
    },
    comparePassword: function(callback) {
      if( !user ) {
        return done(null, false, { message: 'Invalid email or password.' });
      } 

      bcrypt.compare(password, user.password, function(err, match) {
        if(match) {
          return done(null, user);
        } else {
          return done(null, false, { message: 'Invalid email or password.' });
        }
      });
    }
  });
}));

//Sign in with Twitter
passport.use(new TwitterStrategy(secrets.twitter, function(req, accessToken, refreshToken, profile, done) {
  async.series({
    findOrCreateUser: function(callback) {
      User.find({ where: { twitter_uid: profile.id } })
      .done(function( error, current_user ) {
        if( current_user ) {
          return done(null, current_user);
        } else {
          User.create({ 
            first_name: profile.username,
            username: profile.username,
            email_address: profile.username + "@twitter.com",
            last_name: profile.username,
            password: 'password',
            picture: profile._json.profile_image_url,
            location: profile._json.location,
            twitter_uid: profile.id,
            twitter_accesstoken: accessToken,
            twitter_refreshtoken: refreshToken,
          })
          .success(function(user) {
            console.log('twitter create user success!');
            return done(null, user);
          })
          .error(function(err) {
            console.log('twitter create user failure :( ' + JSON.stringify(err));
            return done(null, false, { message: 'Error creating user' });
          })
        }
      });
    }
  });
}));

//Sign in with Google.
passport.use(new GoogleStrategy(secrets.google, function(req, accessToken, refreshToken, profile, done) {
  async.series({
    findOrCreateUser: function(callback) {
      User.find({ where: { google_uid: profile.id } })
      .done(function( error, current_user ) {
        if( current_user ) {
          return done(null, current_user);
        } else {
          User.create({ 
            first_name: profile._json.given_name,
            username: profile._json.name,
            email_address: 'email@provider.com',
            last_name: profile._json.family_name,
            password: 'password',
            gender: profile._json.gender,
            picture: profile._json.picture,
            location: profile._json.locale,
            google_uid: profile._json.id,
            google_accesstoken: accessToken,
            google_refreshtoken: refreshToken,
          })
          .success(function(user) {
            console.log('google create user success!');
            return done(null, user);
          })
          .error(function(err) {
            console.log('google create user failure :( ' + JSON.stringify(err));
            return done(null, false, { message: 'Error creating user' });
          })
        }
      });
    }
  });
}));

//Sign in with Facebook
passport.use(new FacebookStrategy(secrets.facebook, function(req, accessToken, refreshToken, profile, done) {
  console.log('facebook auth ' + JSON.stringify(profile));
  async.series({
    findOrCreateUser: function(callback) {
      User.find({ where: { facebook_uid: profile.id } })
      .done(function( error, current_user ) {
        if( current_user ) {
          return done(null, current_user);
        } else {
          User.create({ 
            first_name: profile.name.given_name,
            username: profile.username, 
            email_address: profile.username + "@facebook.com",
            last_name: profile.name.family_name,
            password: 'password',
            gender: profile.gender,
            location: profile.locale,
            picture: 'https://graph.facebook.com/' + profile.id + '/picture?type=large',
            facebook_uid: profile.id,
            facebook_accesstoken: accessToken,
            facebook_refreshtoken: refreshToken,
          })
          .success(function(user) {
            console.log('facebook create user success!');
            return done(null, user);
          })
          .error(function(err) {
            console.log('facebook create user failure :( ' + JSON.stringify(err));
            return done(null, false, { message: 'Error creating user' });
          })
        }
      });
    }
  });
}));



//Sign in with Github
passport.use(new GitHubStrategy(secrets.github, function(req, accessToken, refreshToken, profile, done) {
  console.log('github auth ' + JSON.stringify(profile));
  async.series({
    findOrCreateUser: function(callback) {
      User.find({ where: { gitHub_uid: profile.id } })
      .done(function( error, current_user ) {
        if( current_user ) {
          return done(null, current_user);
        } else {
          User.create({ 
            username: profile.username, 
            email_address: profile.emails[0].value,
            password: 'password',
            location: profile._json.location,
            picture: profile._json.avatar_url,
            github_uid: profile.id,
            github_accesstoken: accessToken,
            github_refreshtoken: refreshToken,
          })
          .success(function(user) {
            console.log('github create user success!');
            return done(null, user);
          })
          .error(function(err) {
            console.log('github create user failure :( ' + JSON.stringify(err));
            return done(null, false, { message: 'Error creating user' });
          })
        }
      });
    }
  });
}));
