const router = require('express').Router();
const sequelize = require('../../config/connection');

// user is required b/c when getting information about a post,
// information from the user must also be retrieved
const { Post, User, Vote, Comment } = require('../../models');

// get all posts
router.get('/', (req, res) => {
    console.log('======================');
    Post.findAll({
        // the order property is assigned a mested array that orders by the created_at column is descending order
        order: [['created_at', 'DESC']],
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at',
            [
                sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
                'vote_count'
            ]
        ],
        // include property is an array of objects; to define this object, reference the model & attributes(column name)
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    // so that the username can be attached to the comment
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// get one post
router.get('/:id', (req, res) => {
    Post.findOne({
        // the where property is used to set the value of the id using req.params
        where: {
            id: req.params.id
        },
        attributes: [
            'id', 
            'post_url', 
            'title', 
            'created_at',
            [
                sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 
                'vote_count'
            ]
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// create a post
router.post('/', (req, res) => {
    // expects {title: 'title', post_url: 'https://url.com', user_id: 1}
    Post.create({
        title: req.body.title,
        post_url: req.body.post_url,
        user_id: req.body.user_id
    })
      .then(dbPostData => res.json(dbPostData))
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
    // custom static method create in models/Post
    Post.upvote(req.body, { Vote })
      .then(updatedPostData => res.json(updatedPostData))
      .catch(err => {
          console.lof(err);
          res.status(400).json(err);
      });
});

// update a post's title
router.put('/:id', (req, res) => {
    Post.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(404).json({ message: 'No post found with this id' });
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

// delete a post
router.delete('/:id', (req, res) => {
    Post.destroy({
        where: {
            id: req.params.id
        }
    })
      .then(dbPostData => {
          if (!dbPostData) {
              res.status(400).json({ message: 'No post found with this id' });
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
});

module.exports = router;