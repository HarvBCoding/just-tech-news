const express = require('express');
// the router instance in routes/index.js collected everything & packaged them for server to use
const routes = require('./controllers');
// importing the connection to sequelize from config directory
const sequelize = require('./config/connection');
// this will setup Handlebars.js as app's template engine of choice
const exphbs = require('express-handlebars');
// sets up an Express.js session
const session = require('express-session');
const helpers = require('./utils/helpers');
const hbs = exphbs.create({ helpers });

// connects the session to Sequelize database
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(session(sess));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

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