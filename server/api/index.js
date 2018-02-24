const router = require('express').Router();

router.use('/users', require('./user'));

router.use('/stories', require('./story'));

router.use('/sessions', require('./sessions'))

module.exports = router;
