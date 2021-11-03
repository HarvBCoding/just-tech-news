// the Model class and DataTypes object are imported from sequelize;
// the Model class is what we create our own models from using the extends keyword
// so User inherits all of the functionality the Model class has
const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    // set up method to run on instance data (per user) to check password
    checkPassword(loginPw) {
        // using [this] keyword the user's properties (including password) can be accessed
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// use the .init() method to intialize the model's data and configuration, passing in 2 objects as arguments
// the first object will define the columns and data types for those columns, the second object accepts configures certain options for the table
// define table columns and configuration
User.init(
    {
        // define an id column
        id : {
            // use the sequelize DataTypes object to provide what type of data it is
            type: DataTypes.INTEGER,
            // this is the equivelent of SQL's 'NOT NULL' option
            allowNull: false,
            // instruct that this is the primary key
            primaryKey: true,
            // turn on auto increment
            autoIncrement: true
        },
        // define a username column
        username: {
                type: DataTypes.STRING,
                allowNull: false
            },
        // define an email column
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            // there cannot be any duplicate email values in this table
            unique: true,
            // if allowNull is set to false, we can run our data through validators before creating the table data
            validate: {
                isEmail: true
            }
        },
        // define a password column
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // this means the password must be at least 4 characters long
                len: [4]
            }
        }
    },
    // TABLE CONFIGURATION OPTIONS GO HERE
    {
        hooks: {
            // the beforeCreate() hook is used to execute the bcrypt hash function on the plaintext password
            // set up beforeCreate lifecycle "hook" functionality
            async beforeCreate(newUserData) {
                // userData object, which contains the plaintext password in the password property is passed to the bcrypt hash function, we also pass a saltRound of 10
                // the resulting hashed password id then passed to the promise object w/ a hashed password property
                newUserData.password = await bcrypt.hash(newUserData.password, 10);
                return newUserData;
            },
            // set up beforeUpdate lifecycle "hook" functionality
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },
        // pass in the imported sequelize connection (the direct connection to our database)
        sequelize,
        // don't automatically create createdAt/updatedAt timestamp fields
        timestamps: false,
        // don't pluralize name of database table
        freezeTableName: true,
        // use underscores instead of camel-casing
        underscored: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'
    }
);

module.exports = User;