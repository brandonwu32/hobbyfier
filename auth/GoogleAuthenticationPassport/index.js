/*  EXPRESS */
const express = require('express');
const app = express();
const session = require('express-session');

app.set('view engine', 'ejs');

app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET'
}));

app.get('/', function(req, res) {
  res.render('pages/auth');
});

const port = process.env.PORT || 3001;
app.listen(port , () => console.log('App listening on port ' + port));


var passport = require('passport');
var userProfile;

app.use(passport.initialize());
app.use(passport.session());

app.get('/success', (req, res) => {
  res.render('pages/success', {user: userProfile});
});
app.get('/error', (req, res) => res.send("error logging in"));

passport.serializeUser(function(user, cb) {
  cb(null, user);
});

passport.deserializeUser(function(obj, cb) {
  cb(null, obj);
});


/*  Google AUTH  */

var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const GOOGLE_CLIENT_ID = 'our-google-client-id';
const GOOGLE_CLIENT_SECRET = 'our-google-client-secret';

passport.use(new GoogleStrategy({
    clientID: "499248250345-io5t6k9pho9vqlb9klirsn4g5lultj2m.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:3001/auth/google/callback"
  },
  function(accessToken, refreshToken, profile, done) {
      userProfile=profile;
      return done(null, userProfile);
  }
));

app.get('/auth/google',
  passport.authenticate('google', { scope : ['profile', 'email', 'https://www.googleapis.com/auth/calendar.events'] }));

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/error' }),
  function(req, res) {
    // Successful authentication, redirect success.
    res.redirect('/success');
  });