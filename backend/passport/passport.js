var _ = require('underscore'),
passport = require('passport'),
bcrypt = require('bcrypt'),
async = require('async'),
LocalStrategy = require('passport-local').Strategy,
/*
var FacebookStrategy = require('passport-facebook').Strategy;
var TwitterStrategy = require('passport-twitter').Strategy;
var GitHubStrategy = require('passport-github').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
var OAuthStrategy = require('passport-oauth').OAuthStrategy; // Tumblr
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy; // Venmo, Foursquare
*/
db = require('../db/sql'),
User = db.User.model,
secrets = require('./secrets');

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.find({ where: {id: id} })
  .success(function(user) {
    console.log('deserializeUser success');
    done(null, user);
  })
  .failure(function(error) {
    console.log('deserializeUser failure');
    done(error, null);
  })
});

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
  console.log('shit');
  var user = null;
  async.series({
    findUser: function(callback) {
      console.log('finduser');
      User.find({ where: { username: username } })
      .success(function(foundUser) {
        user = foundUser;
        callback();
      });
    },
    comparePassword: function(callback) {
      console.log('compare password');
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

exports.localSignIn = function(req, res, next) {

  passport.authenticate('local', function(err, user, info) {
    if (err) return next(err);

    if (!user) {
      req.flash('errors', { msg: info.message });
      return res.redirect('/login');
    }

    req.logIn(user, function(err) {
      if (err) return next(err);
      req.flash('success', { msg: 'Success! You are logged in.' });
      return res.redirect('/');
    });
  })(req, res, next);
};

exports.isAuthenticated = function(req, res, next) {
  if (req.isAuthenticated()) return next();
  res.redirect('/login');
};

/*
//Sign in with Facebook.
passport.use(new FacebookStrategy(secrets.facebook, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ $or: [{ facebook: profile.id }, { email: profile.email }] }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Facebook account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken: accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.save(function(err) {
            req.flash('info', { msg: 'Facebook account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ facebook: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Facebook manually from Account Settings.' });
          done(err);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.facebook = profile.id;
          user.tokens.push({ kind: 'facebook', accessToken: accessToken });
          user.profile.name = profile.displayName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = 'https://graph.facebook.com/' + profile.id + '/picture?type=large';
          user.profile.location = (profile._json.location) ? profile._json.location.name : '';
          user.save(function(err) {
            done(err, user);
          });
        }
      });
    });
  }
}));

//Sign in with Github
passport.use(new GitHubStrategy(secrets.github, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ $or: [{ github: profile.id }, { email: profile.email }] }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a GitHub account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken: accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.picture = user.profile.picture || profile._json.avatar_url;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.website = user.profile.website || profile._json.blog;
          user.save(function(err) {
            req.flash('info', { msg: 'GitHub account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ github: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with GitHub manually from Account Settings.' });
          done(err);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.github = profile.id;
          user.tokens.push({ kind: 'github', accessToken: accessToken });
          user.profile.name = profile.displayName;
          user.profile.picture = profile._json.avatar_url;
          user.profile.location = profile._json.location;
          user.profile.website = profile._json.blog;
          user.save(function(err) {
            done(err, user);
          });
        }
      });
    });
  }
}));

//Sign in with Twitter
passport.use(new TwitterStrategy(secrets.twitter, function(req, accessToken, tokenSecret, profile, done) {
  if (req.user) {
    User.findOne({ twitter: profile.id }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Twitter account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.twitter = profile.id;
          user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.location = user.profile.location || profile._json.location;
          user.profile.picture = user.profile.picture || profile._json.profile_image_url;
          user.save(function(err) {
            req.flash('info', { msg: 'Twitter account has been linked.' });
            done(err, user);
          });
        });
      }
    });

  } else {
    User.findOne({ twitter: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      var user = new User();
      // Twitter will not provide an email address.  Period.
      // But a person’s twitter username is guaranteed to be unique
      // so we can "fake" a twitter email address as follows:
      user.email = profile.username + "@twitter.com";
      user.twitter = profile.id;
      user.tokens.push({ kind: 'twitter', accessToken: accessToken, tokenSecret: tokenSecret });
      user.profile.name = profile.displayName;
      user.profile.location = profile._json.location;
      user.profile.picture = profile._json.profile_image_url;
      user.save(function(err) {
        done(err, user);
      });
    });
  }
}));

//Sign in with Google.
passport.use(new GoogleStrategy(secrets.google, function(req, accessToken, refreshToken, profile, done) {
  if (req.user) {
    User.findOne({ $or: [{ google: profile.id }, { email: profile.email }] }, function(err, existingUser) {
      if (existingUser) {
        req.flash('errors', { msg: 'There is already a Google account that belongs to you. Sign in with that account or delete it, then link it with your current account.' });
        done(err);
      } else {
        User.findById(req.user.id, function(err, user) {
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken: accessToken });
          user.profile.name = user.profile.name || profile.displayName;
          user.profile.gender = user.profile.gender || profile._json.gender;
          user.profile.picture = user.profile.picture || profile._json.picture;
          user.save(function(err) {
            req.flash('info', { msg: 'Google account has been linked.' });
            done(err, user);
          });
        });
      }
    });
  } else {
    User.findOne({ google: profile.id }, function(err, existingUser) {
      if (existingUser) return done(null, existingUser);
      User.findOne({ email: profile._json.email }, function(err, existingEmailUser) {
        if (existingEmailUser) {
          req.flash('errors', { msg: 'There is already an account using this email address. Sign in to that account and link it with Google manually from Account Settings.' });
          done(err);
        } else {
          var user = new User();
          user.email = profile._json.email;
          user.google = profile.id;
          user.tokens.push({ kind: 'google', accessToken: accessToken });
          user.profile.name = profile.displayName;
          user.profile.gender = profile._json.gender;
          user.profile.picture = profile._json.picture;
          user.save(function(err) {
            done(err, user);
          });
        }
      });
    });
  }
}));

//Login Required middleware.



//Authorization Required middleware.
exports.isAuthorized = function(req, res, next) {
  var provider = req.path.split('/').slice(-1)[0];
  if (_.findWhere(req.user.tokens, { kind: provider })) next();
  else res.redirect('/auth/' + provider);
};
*/