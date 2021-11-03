const router = require('express').Router();

const userRoutes = require('./user-routes.js');
const postRoutes = require('./post-routes');

// prefixes /users to all routes in the user-routes.js file
router.use('/users', userRoutes);
router.use('/posts', postRoutes);


module.exports = router;