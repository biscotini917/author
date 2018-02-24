const express = require('express');
const app = express();
const path = require('path');
const volleyball = require('volleyball');
const bodyParser = require('body-parser');
const session = require('express-session');
const User = require('./db/models/user');

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


/* "Enhancing" middleware (does not send response, server-side effects only) */
app.use(volleyball);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

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
