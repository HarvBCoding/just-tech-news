const express = require('express');
// the router instance in routes/index.js collected everything & packaged them for server to use
const routes = require('./routes');
// inporting the connection to sequelize from config directory
const sequelize = require('./config/connection');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// turn on routes
app.use(routes);

// sequelize sync() method is used to establish the connection to the database;
// sync means that this is sequelize taking the models & connecting them to associated db tables;
// if it doesn't find a table it will create one
// if force: false was set to true it would drop and re-create all of the dab tables on startup
// turn on connection to db and server
sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});