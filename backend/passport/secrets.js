module.exports = {

  facebook: {
    clientID: '250267481799901',
    clientSecret: 'b9b605f16fddfadb144ae4156df9f105',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  github: {
    clientID: '7e70bdbf9b96de282505',
    clientSecret: '31f5e47d06915d601b2efa283c760b29a1abf09b',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitter: {
    consumerKey: 'wTMl59EYPCCZdpLGBlFg',
    consumerSecret: 'slTVng7Hc7Mpgz1tIPJfELyWRjD4BEhpbv8Fr8v1Ec',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  google: {
    clientID: '184469455744-bq9g5da0hj3neb2lfp7mdhluo8082sha.apps.googleusercontent.com',
    clientSecret: 'JgqwZN0Hh7ZRvA8J3oA_1rT7',
    callbackURL: '/auth/google/callback',
    scope: 'https://www.googleapis.com/auth/plus.login',
    passReqToCallback: true
  },
  
};