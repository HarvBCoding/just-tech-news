const router = require('express').Router();

const userRoutes = require('./user-routes.js');

// prefixes /users to all routes in the user-routes.js file
router.use('/users', userRoutes);

module.exports = router;