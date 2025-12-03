const {
  listCommunityPosts,
  createCommunityPost,
  addLikeToPost,
  createCommunityComment,
  getCommentsForPost
} = require('../db');

const listPosts = async (req, res) => {
  try {
    const posts = await listCommunityPosts();

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await getCommentsForPost(post.id);
        return { ...post, comments };
      })
    );

    return res.json(postsWithComments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const createPost = async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await createCommunityPost(req.user.id, content.trim());
    return res.status(201).json({ ...post, comments: [] });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const liked = await addLikeToPost(id);

    if (!liked) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json({ message: 'Post liked' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await createCommunityComment(id, req.user.id, content.trim());
    return res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  listPosts,
  createPost,
  likePost,
  addComment
};
