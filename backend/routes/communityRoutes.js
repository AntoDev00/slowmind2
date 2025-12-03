const express = require('express');
const authenticate = require('../middleware/auth');
const {
  listPosts,
  createPost,
  likePost,
  addComment
} = require('../controllers/communityController');

const router = express.Router();

router.get('/community/posts', authenticate, listPosts);
router.post('/community/posts', authenticate, createPost);
router.post('/community/posts/:id/like', authenticate, likePost);
router.post('/community/posts/:id/comments', authenticate, addComment);

module.exports = router;
