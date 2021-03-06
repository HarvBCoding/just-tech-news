const router = require('express').Router();

const apiRoutes = require('./api');
const homeRoutes = require('./home-routes.js');
const dashboardRoutes = require('./dashboard-routes.js');

// collecting the packaged group of API endpoints 
// & prefixing them w/ the path /api
router.use('/api', apiRoutes);
router.use('/', homeRoutes);
router.use('/dashboard', dashboardRoutes);

// this router.use() is so if a request is made to any endpoint that doesn't exist
// a 404 error will be sent indicating an incorrect resource has been requested
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;