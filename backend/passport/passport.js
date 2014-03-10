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

var social_account_password = 'social_account'

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
  bcrypt.genSalt(10, function(err, salt) {
    if (err) {
      return new Error('backend/passport/passport.js: bcrypt salting error');
    }
    bcrypt.hash(plaintext_password, salt, function(error, password) {
      if(error) {
        return new Error('backend/passport/passport.js: bcrypt hashing error');
      }
      callback(null, password);
    });
  });
}

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
            return res.json({ 
              error: { username:'Username is already being used' }
            });
          }
          callback(null);
        });
    },
    // encrypt password and pass it to create user
    function encryptPassword(callback) {
      if(req.body.password === req.body.confirm_password) { 
        exports.hashPassword(req.body.password, callback)
      } else {
        return res.json({ 
          error: { confirm_password:'Passwords do not match' }
        });
      }
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
        return res.json({ 
          error: err
        });
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
      // Search for twitter_uid - either link the account, return an existing account, or create account

      User.find({ where: { twitter_uid : profile.id } })
      .done(function( error, current_user ) {
        if( req.user ) {
          if( current_user && req.user !== current_user ) {
            return done(null, false, { message:'Twitter account already linked to another account' });
          }
          // User found - update/link with twitter credentials
          req.user.updateAttributes({
            twitter_uid: profile.id,
            twitter_accesstoken: accessToken,
            twitter_refreshtoken: refreshToken,
            location: isEmptyOrNull(req.user.location) ? profile._json.location : req.user.location,
            picture: isEmptyOrNull(req.user.picture) ? profile._json.profile_image_url : req.user.picture,
          });

          return done(null, req.user);

        } else if( current_user ) {
          // user found - no active user just return current user
          return done(null, current_user);

        } else {
          // no user found - create account with credentials
          var name = profile._json.name.split(' ');
          User.create({ 
            first_name: name[0],
            username: profile.username + profile.id,
            email_address: profile.username + "@twitter.com",
            last_name: name[1],
            password: social_account_password,
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
      // Search for google_uid - either link the account, return an existing account, or create account

      User.find({ where: { google_uid: profile._json.id } })
      .done(function( error, current_user ) {
        if( req.user ) {
          if( current_user && req.user !== current_user ) {
            return done(null, false, { message:'Google account already linked to another account' });
          }
          // found current user - link google account
          req.user.updateAttributes({
            google_uid: profile._json.id,
            google_accesstoken: accessToken,
            google_refreshtoken: refreshToken,
            location: isEmptyOrNull(req.user.location) ? profile._json.locale : req.user.location,
            picture: isEmptyOrNull(req.user.picture) ? profile._json.picture : req.user.picture,
            gender: isEmptyOrNull(req.user.gender) ? profile._json.gender : req.user.gender,
          });

          return done(null, req.user);

        } else if( current_user ) {
          // user found - no active user just return current user
          return done(null, current_user);

        } else {
          User.create({ 
            // no user found - create new user with google credentials
            first_name: profile._json.given_name,
            username: profile._json.name.replace(/ /g,'').toLowerCase() + profile._json.id,
            email_address: 'email@provider.com',
            last_name: profile._json.family_name,
            password: social_account_password,
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
      // Search for facebook_uid - either link the account, return an existing account, or create account
      var profile_image = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';

      User.find({ where: { facebook_uid: profile.id } })
      .done(function( error, current_user ) {
        if( req.user ) {
          if( current_user && req.user !== current_user ) {
            return done(null, false, { message:'Facebook account already linked to another account' });
          }
          // found current user - link facebook account
          req.user.updateAttributes({
            facebook_uid: profile.id,
            facebook_accesstoken: accessToken,
            facebook_refreshtoken: refreshToken,
            location: isEmptyOrNull(req.user.location) ? profile._json.locale : req.user.location,
            picture: isEmptyOrNull(req.user.picture) ? profile_image : req.user.picture,
            gender: isEmptyOrNull(req.user.gender) ? profile.gender : req.user.gender,
          });

          return done(null, req.user);

        } else if( current_user ) {
          // user found - no active user just return current user
          return done(null, current_user);

        } else {
          // no user found create new account from fb credentials
          User.create({ 
            first_name: profile.name.givenName,
            username: profile.username + profile.id, 
            email_address: profile.username + "@facebook.com",
            last_name: profile.name.familyName,
            password: social_account_password,
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
      // Search for github_uid - either link the account, return an existing account, or create account

      User.find({ where: { github_uid: profile.id } })
      .done(function( error, current_user ) {
        if( req.user ) {
          if( current_user && req.user !== current_user ) {
            return done(null, false, { message:'GitHub account already linked to another account' });
          }

          // link github account to current user
           req.user.updateAttributes({
            github_uid: profile.id,
            github_accesstoken: accessToken,
            github_refreshtoken: refreshToken,
            location: isEmptyOrNull(req.user.location) ? profile._json.location : req.user.location,
            picture: isEmptyOrNull(req.user.picture) ? profile._json.avatar_url : req.user.picture,
          });

          return done(null, req.user);

        } else if( current_user ) {
          // user found - no active user just return current user
          return done(null, current_user);

        } else {
          // no user found - create new user with github credentials
          var name = profile._json.name.split(' ');
          User.create({ 
            username: profile.username + profile.id, 
            first_name: name[0],
            last_name: name[1],
            email_address: profile.emails[0].value,
            password: social_account_password,
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
