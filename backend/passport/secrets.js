module.exports = {

  /* Insert your secrets here!*/
  facebook: {
    clientID: 'app id goes here',
    clientSecret: 'app secret goes here',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  github: {
    clientID: 'client id goes here',
    clientSecret: 'client secret goes here',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: 'api key goes here',
    consumerSecret: 'api secret goes here',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  google: {
    clientID: 'client id goes here',
    clientSecret: 'client secret goes here',
    callbackURL: '/auth/google/callback',
    scope: 'https://www.googleapis.com/auth/plus.login',
    passReqToCallback: true
  },
  
};