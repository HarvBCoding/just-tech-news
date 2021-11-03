const User = require('./User');
const Post = require('./Post');

// create associations
// the statement makes an association & defines the relationship of the User model to the Post model
// this association creates the reference for the id column in the User model 
// to link the corresponding foreign key pair (the user_id in the Post model)
User.hasMany(Post, {
    foreignKey: 'user_id'
});

// the statement makes a reverse association & defines the relationship of the Post model to the User
// a constraint is imposed that a post can belong to one user, but not many users
Post.belongsTo(User, {
    foreignKey: 'user_id'
});

module.exports = { User, Post };