const router = require('express').Router();

router.get('/', (req, res) => {
    // will render the homepage.handlebars to this route
    res.render('homepage');
});

module.exports = router;