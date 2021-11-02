// import the Sequelize constructor class from the library
const Sequelize = require('sequelize');
require('dotenv').config();


// create connection to our database, pass in your MySQL information for username and password
// the new Sequelize() function accepts the database name, MySQL username and MySQL password, then pass configuration settings
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});

module.exports = sequelize;