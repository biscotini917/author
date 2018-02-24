const express = require('express');
const app = express();
const path = require('path');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const {User} = require('./db/models')
const key = require('../secrets')

app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'tongiscool', // or whatever you like
  // this option is recommended and reduces session concurrency issues
  resave: false
}));

app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

//using to count pings to server
app.use('/api', function (req, res, next) {
  if (!req.session.counter) req.session.counter = 0;
  console.log('counter', ++req.session.counter);
  next();
});
//PASSPORT///

//telling passport that we want a 'google' strategy and configuring it
passport.use(new GoogleStrategy(key, (accessToken, refreshToken, profile, goForwardAndSerializeUser) => {
  //this callback occurs after a successful login with google
  //find or create a user with the given google profile id
  console.log(profile.id, 'profile')
  User.findOne({
    where: {
      googleProfileId: profile.id
    }
  })
    .then(user => {
      if (user) return user;
      return User.create({
        name: profile.displayName,
        photo: profile.photos[0].value,
        email: profile.emails[0].value,
        googleProfileId: profile.id
      });
    })
    .then(user => {
      //done is our ability to tell passport: we've finished doing what we want, here's the logged in user, next/done/goForwardAndSerializeUser, serializing the user
      //a lot like 'next' in express
      goForwardAndSerializeUser(null, user);
    })
    .catch(goForwardAndSerializeUser)
}));

//configuring user <=> session stuff about passport
//serialize user will happen 'once', when a user successfully logs in with google
//'take an object and turn into easy to use'
passport.serializeUser((user, done) => {
  done(null, user.id)
});
//deserialize user will happen for EVERY REQUEST
//'take stored and convert to complex
passport.deserializeUser((id, assignRequestToUser) => {
  User.findById(id)
    .then(user => {
      assignRequestToUser(null, user);
    })
    .catch(assignRequestToUser)
});

/* "Enhancing" middleware (does not send response, server-side effects only) */
app.use(volleyball);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//misc express-related passport stuff
app.use(passport.initialize());
// for establishing req.user
app.use(passport.session());

app.get('/auth/google', passport.authenticate('google', {
  // scope is 'permission scope', i.e. here we want access to users; email addresses
  scope: 'email'
}))

// for users who request to 'login with google'
app.get('/auth/google', (passport.authenticate('google')));
//when users have successfully logged in with google, where google sends them to
app.get('/auth/google/callback', (passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/'
})));


/* "Responding" middleware (may send a response back to client) */
app.use('/api', require('./api'));

const validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
const indexPath = path.join(__dirname, '../public/index.html');
validFrontendRoutes.forEach(stateRoute => {
  app.get(stateRoute, (req, res, next) => {
    res.sendFile(indexPath);
  });
});

/* Static middleware */
app.use(express.static(path.join(__dirname, '../public')))
app.use(express.static(path.join(__dirname, '../node_modules')))

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).send(err.message || 'Internal Error');
});

module.exports = app;
