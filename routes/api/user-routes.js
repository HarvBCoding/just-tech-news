const router = require('express').Router();
const { User } = require('../../models');

// GET /api/users
router.get('/', (req, res) => {
    // access the User model & run findAll() method
    // the findAll() method queries all of the users from the user table
    User.findAll({ 
        // the attributes key is provided as an argument & instructed the query to exclude the password column
        // the password column is in an array in case another column needs to be excluded
        attributes: { exclude: ['password'] }
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    // findOne() method indicates to send only one piece of data back
    // an argument is passed into findOne() that uses JS objects to configure a query
    User.findOne({
        attributes: { exclude: ['password'] },
        // the where option is used to find a user where the id is the req.params
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id'})
              return;
          }
          res.json(dbUserData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// POST /api/users
router.post('/', (req, res) => {
    // to insert data use .create() method, pass in key/value pairs 
    // where the keys are what's defined in the user model and the values are what comes back from req.body
    // expects { username: value, email: value@val, password:'pw'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
      .then(dbUserData => res.json(dbUserData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// login route
router.post('/login', (req, res) => {
    // expects {email:'email@value', password: 'passwordValue'}
    // query user table for the email entered by the user in req.body.email
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            // if the user w/ that email was NOT found send a message to the client
            res.status(400).json({ message: 'No user with that email address'});
            return;
        }
       
        // verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password' });
            return;
        }

        res.json({ user: dbUserData, message: 'You are now logged in!'});
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'value', email: 'value@val', password: 'pw'}

    // .update() method combines the parameters for creating data and looking up data
    // req.body is used to provide the new data to use in the update & req.params.id to indicate where the new data should be used 
    // if req.body has exact key/value pairs to match the model, use req.body instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
          if (!dbUserData[0]) {
              res.status(404).json({ message: 'No user found with this id'});
              return;
          }
          res.json(dbUserData);
      })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    // to delete data, use the .destroy() method & provide some type of identifier 
    // to indicate where exactly to delete the data from the user database table 
    User.destroy({
        where: {
            id: req.params.id
        }
    })
      .then(dbUserData => {
          if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id'});
              return;
          }
          res.json(dbUserData);
      })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;