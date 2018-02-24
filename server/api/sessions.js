const router = require('express').Router();
const { User } = require('../db/models')

//signup
router.post('/', (req, res, next) => {
  console.log(req.body, 'am i here....backend route')
  User.create(req.body)
    .then(newUser => {
      req.session.currentLoggedInUserId = newUser.id;
      res.status(201).json(newUser)
    })
    .catch(next)
})

//login
router.put('/', (req, res, next) => {
  console.log(req.body, 'body')
  User.findOne({
    where: req.body
  })
    .then(loggedInUser => {
      if (!loggedInUser) {
        res.sendStatus(401)
      } else {
        // console.log(user, 'current user id')
        req.session.currentLoggedInUserId = loggedInUser.id;
        res.status(200).json(loggedInUser)
      }
    })
      .catch(next)
})

//current user
router.get('/', (req, res, next) => {
  if (req.session.hasOwnProperty('currentLoggedInUserId')) {
    User.findById(req.session.currentLoggedInUserId)
      .then(currentUser => {
        res.json(currentUser)
      })
      .catch(next)
  } else {
    res.json({})
  }
})

module.exports = router;
