const User = require('./User');
const Post = require('./Post');
const Vote = require('./Vote');

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

// the 2 belongsToMany() methods allow both the User and Post models to query each other's information in the context of a vote
// in the syntax the application is instructed that the User and Post models will be connected 
User.belongsToMany(Post, {
    // but through the Vote model; this states that the foreign key will be in Vote, which aligns w/ what is set up in model
    through: Vote,
    // this stipulates that the name of the Vote model should be displayed as voted_posts
    as: 'voted_posts',
    foreignKey: 'user_id'
});

// the Vote table needs a row of data to be a unique paring so that it knows whoch data to pull in when queried on;
// b/c the user_id and post_id parings must be unique the app is protected from a single user voting on one post multiple times
// this layer is called a foreign key constraint
Post.belongsToMany(User, {
    through: Vote,
    as: 'voted_posts',
    foreignKey: 'post_id'
});

// this syntax defines a constraint relationship btw Vote model & User model
// a constraint is imposed that 1 vote may be long to a user in a row for one post
Vote.belongsTo(User, {
    // defines the foreign key in the vote model
    foreignKey: 'user_id'
});

// this syntax defines a contraint relationship btw the Vote model & the Post model
// a constraint is imposed that 1 vote may belong to a Post in a row
// combined w/ the previous statement it ensures only one vote per user per post
Vote.belongsTo(Post, {
    foreignKey: 'post_id'
});

// the statement defines the relationship of the User model to the Vote model
// this association creates the reference for the id column in the User model 
// to link the corresponding foreign key pair (the user_id in the Vote model)
User.hasMany(Vote, {
    foreignKey: 'user_id'
});

// the statement defines the relationship of the Post model to the Vote model
// this association creates the reference for the id column in the Post model 
// to link the corresponding foreign key pair (the post_id in the Vote model)
Post.hasMany(Vote, {
    foreignKey: 'post_id'
});

module.exports = { User, Post, Vote };