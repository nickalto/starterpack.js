module.exports = {

  mailgun: {
    login: 'Your Mailgun SMTP Username',
    password: 'Your Mailgun SMTP Password'
  },

  sendgrid: {
    user: 'Your SendGrid Username',
    password: 'Your SendGrid Password'
  },

  gmail: {
    user: 'Your Gmail Username',
    password: 'Your Gmail Password'
  },

  facebookAuth: true,
  facebook: {
    clientID: 'Your App ID',
    clientSecret: 'Your App Secret',
    callbackURL: '/auth/facebook/callback',
    passReqToCallback: true
  },

  githubAuth: true,
  github: {
    clientID: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    callbackURL: '/auth/github/callback',
    passReqToCallback: true
  },

  twitterAuth: true,
  twitter: {
    consumerKey: 'Your Consumer Key',
    consumerSecret: 'Your Consumer Secret',
    callbackURL: '/auth/twitter/callback',
    passReqToCallback: true
  },

  googleAuth: true,
  google: {
    clientID: 'Your Client ID',
    clientSecret: 'Your Client Secret',
    callbackURL: '/auth/google/callback',
    passReqToCallback: true
  },
};