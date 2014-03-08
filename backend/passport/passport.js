var passport      = require('passport'),
bcrypt            = require('bcrypt'),
async             = require('async'),
LocalStrategy     = require('passport-local').Strategy,
GoogleStrategy    = require('passport-google-oauth').OAuth2Strategy,
TwitterStrategy   = require('passport-twitter').Strategy,
FacebookStrategy  = require('passport-facebook').Strategy,
GitHubStrategy    = require('passport-github').Strategy,
secrets           = require('./secrets'),
User              = require('../db/sql').User;

//Passport required serialization
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// passport required deserialize find user given id from serialize
passport.deserializeUser(function(id, done) {
  User.find({ where: { id: id } })
  .success(function(user) {
    done(null, user);
  })
  .failure(function(error) {
    done(error, null);
  })
});

// Use bcrypt to hash users plaintext password - plaintext is bad - hashed is good - bcrypt is great
exports.hashPassword = function (plaintext_password, callback) {
  bcrypt.hash(plaintext_password, 5, function(err, password) {
      if(err) {
        return new Error('backend/passport/passport.js: bcrypt hashing error');
      }
      callback(null, password);
  });
}

//Surfaces errors from sequelize
exports.error = function(res, json) {
  return res.json({ 
    error: json
  });
};

// Helper function to test for valid value
function isEmptyOrNull(value) {
  return (value === null || value == '' || value == undefined);
}; 

// Create a local user
exports.localAuthentication = function(req, res) {
  var password = null;
  async.waterfall([
    // make sure username has not already been taken
    function validateUsername (callback) {
      User.find({ where: { username: req.body.username } })
        .done(function(error, user) {
          if(user) {
            exports.error(res, { username:'Username is already being used' });
          }
          callback(null);
        });
    },
    // encrypt password and pass it to create user
    function encryptPassword(callback) {
      exports.hashPassword(req.body.password, callback)
    },
    // create user with hashed password
    function createUser(hashed_password, callback) {
      User.create({ 
        username: req.body.username,
        first_name: req.body.first_name,
        email_address: req.body.email_address,
        last_name: req.body.last_name,
        password: hashed_password
      })
      .success(function(user) {
        req.user = req.session.user = user;
        res.json({ redirect: '/login'});
      })
      .error(function(err) {
          exports.error(res, err);
      })
    }
  ]);
};

//Sign in using username and Password.
passport.use(new LocalStrategy( function(username, password, done) {
  async.waterfall([
    // look for user with given username
    function findUser(callback) {
      User.find({ where: { username: username } })
      .success(function(user) {
        callback(null, user);
      })
      .failure(function(error) {
          return done(null, false, { message: 'User not found' });
      })
    },
    // make sure password is valid
    function comparePassword(user, callback) {
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
  ]);
}));

//Sign in with Twitter
passport.use(new TwitterStrategy(secrets.twitter, function(req, accessToken, refreshToken, profile, done) {
  async.series({
    findOrCreateUser: function(callback) {
      // If user is signed in search for current user otherwise search on twitter id
      var query = req.user ? ["id = ?", req.user.id] : ["twitter_uid = ?", profile.id];
      User.find({ where: query })
      .done(function( error, current_user ) {
        if( current_user ) {
          // User found - update/link with twitter credentials
          current_user.updateAttributes({
            twitter_uid: profile.id,
            twitter_accesstoken: accessToken,
            twitter_refreshtoken: refreshToken,
            location: isEmptyOrNull(current_user.location) ? profile._json.location : current_user.location,
            picture: isEmptyOrNull(current_user.picture) ? profile._json.profile_image_url : current_user.picture,
          });
          return done(null, current_user);
        } else {
          // no user found - create account with credentials
          var name = profile._json.name.split(' ');
          User.create({ 
            first_name: name[0],
            username: profile.username,
            email_address: profile.username + "@twitter.com",
            last_name: name[1],
            password: 'password',
            picture: profile._json.profile_image_url,
            location: profile._json.location,
            twitter_uid: profile.id,
            twitter_accesstoken: accessToken,
            twitter_refreshtoken: refreshToken,
          })
          .success(function(user) {
            return done(null, user);
          })
          .error(function(err) {
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
      // If user is signed in search for current user otherwise search on google id
      var query = req.user ? ["id = ?", req.user.id] : ["google_uid = ?", profile._json.id];
      User.find({ where: query })
      .done(function( error, current_user ) {
        if( current_user ) {
          // found current user - link google account
          current_user.updateAttributes({
            google_uid: profile._json.id,
            google_accesstoken: accessToken,
            google_refreshtoken: refreshToken,
            location: isEmptyOrNull(current_user.location) ? profile._json.locale : current_user.location,
            picture: isEmptyOrNull(current_user.picture) ? profile._json.picture : current_user.picture,
            gender: isEmptyOrNull(current_user.gender) ? profile._json.gender : current_user.gender,
          });
          return done(null, current_user);
        } else {
          User.create({ 
            // no user found - create new user with google credentials
            first_name: profile._json.given_name,
            username: profile._json.name.replace(/ /g,'').toLowerCase(),
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
            return done(null, user);
          })
          .error(function(err) {
            return done(null, false, { message: 'Error creating user' });
          })
        }
      });
    }
  });
}));


//Sign in with Facebook
passport.use(new FacebookStrategy(secrets.facebook, function(req, accessToken, refreshToken, profile, done) {
  async.series({
    findOrCreateUser: function(callback) {
      // If user is signed in search for current user otherwise search on facebook id
      var query = req.user ? ["id = ?", req.user.id] : ["facebook_uid = ?", profile.id];
      var profile_image = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
      User.find({ where: query })
      .done(function( error, current_user ) {
        if( current_user ) {
          // found current user - link facebook account
          current_user.updateAttributes({
            facebook_uid: profile.id,
            facebook_accesstoken: accessToken,
            facebook_refreshtoken: refreshToken,
            location: isEmptyOrNull(current_user.location) ? profile._json.locale : current_user.location,
            picture: isEmptyOrNull(current_user.picture) ? profile_image : current_user.picture,
            gender: isEmptyOrNull(current_user.gender) ? profile.gender : current_user.gender,
          });
          return done(null, current_user);
        } else {
          // no user found create new account from fb credentials
          User.create({ 
            first_name: profile.name.givenName,
            username: profile.username, 
            email_address: profile.username + "@facebook.com",
            last_name: profile.name.familyName,
            password: 'password',
            gender: profile.gender,
            location: profile._json.locale,
            picture: profile_image,
            facebook_uid: profile.id,
            facebook_accesstoken: accessToken,
            facebook_refreshtoken: refreshToken,
          })
          .success(function(user) {
            return done(null, user);
          })
          .error(function(err) {
            return done(null, false, { message: 'Error creating user' });
          })
        }
      });
    }
  });
}));


//Sign in with Github
passport.use(new GitHubStrategy(secrets.github, function(req, accessToken, refreshToken, profile, done) {
  async.series({
    findOrCreateUser: function(callback) {
      // If user is signed in search for current user otherwise search on facebook id
      var query = req.user ? ["id = ?", req.user.id] : ["github_uid = ?", profile.id];
      User.find({ where: query })
      .done(function( error, current_user ) {
        if( current_user ) {
          // link github account to current user
           current_user.updateAttributes({
            github_uid: profile.id,
            github_accesstoken: accessToken,
            github_refreshtoken: refreshToken,
            location: isEmptyOrNull(current_user.location) ? profile._json.location : current_user.location,
            picture: isEmptyOrNull(current_user.picture) ? profile._json.avatar_url : current_user.picture,
          });
          return done(null, current_user);
        } else {
          // no user found - create new user with github credentials
          var name = profile._json.name.split(' ');
          User.create({ 
            username: profile.username, 
            first_name: name[0],
            last_name: name[1],
            email_address: profile.emails[0].value,
            password: 'password',
            location: profile._json.location,
            picture: profile._json.avatar_url,
            github_uid: profile.id,
            github_accesstoken: accessToken,
            github_refreshtoken: refreshToken,
          })
          .success(function(user) {
            return done(null, user);
          })
          .error(function(err) {
            return done(null, false, { message: 'Error creating user' });
          })
        }
      });
    }
  });
}));
