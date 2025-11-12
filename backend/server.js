const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config();

const { PORT, JWT_SECRET, ALLOWED_ORIGINS } = require('./config');
const {
  getUserByEmailWithPassword,
  getUserById,
  createUser,
  updateUser,
  createMeditationSession,
  getMeditationSessionsByUser,
  deleteMeditationSession,
  getQuotes,
  getQuoteOfTheDay,
  createCommunityPost,
  listCommunityPosts,
  addLikeToPost,
  createCommunityComment,
  getCommentsForPost
} = require('./db');

const app = express();

// Middleware
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json());

// Authentication middleware
const authenticate = (req, res, next) => {
  const token = req.header('x-auth-token');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

// Routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email, and password are required' });
    }

    const existingUser = await getUserByEmailWithPassword(email);
    if (existingUser?.user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await createUser(username, email, hashedPassword);

    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: newUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const userRecord = await getUserByEmailWithPassword(email);
    if (!userRecord?.user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, userRecord.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: userRecord.user.id, email: userRecord.user.email, username: userRecord.user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: userRecord.user
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/users/me', authenticate, async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.put('/api/users/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    if (Number(id) !== req.user.id) {
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const { username, bio, preferences } = req.body;

    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    await updateUser(req.user.id, { username, bio, preferences });
    const updatedUser = await getUserById(req.user.id);

    res.json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/quotes', authenticate, async (req, res) => {
  try {
    const quotes = await getQuotes();
    res.json(quotes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/quotes/daily', async (req, res) => {
  try {
    const quote = await getQuoteOfTheDay();
    res.json(quote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/meditations', authenticate, async (req, res) => {
  try {
    const { duration, type, notes } = req.body;

    if (!duration) {
      return res.status(400).json({ message: 'Duration is required' });
    }

    const session = await createMeditationSession(req.user.id, { duration, type, notes });
    res.status(201).json({ message: 'Meditation session recorded', session });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/api/meditations', authenticate, async (req, res) => {
  try {
    const sessions = await getMeditationSessionsByUser(req.user.id);
    res.json(sessions);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.delete('/api/meditations/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteMeditationSession(req.user.id, id);

    if (!deleted) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Community routes
app.get('/api/community/posts', authenticate, async (req, res) => {
  try {
    const posts = await listCommunityPosts();

    const postsWithComments = await Promise.all(
      posts.map(async (post) => {
        const comments = await getCommentsForPost(post.id);
        return { ...post, comments };
      })
    );

    res.json(postsWithComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/community/posts', authenticate, async (req, res) => {
  try {
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const post = await createCommunityPost(req.user.id, content.trim());
    res.status(201).json({ ...post, comments: [] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/community/posts/:id/like', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const liked = await addLikeToPost(id);

    if (!liked) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json({ message: 'Post liked' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/community/posts/:id/comments', authenticate, async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ message: 'Content is required' });
    }

    const comment = await createCommunityComment(id, req.user.id, content.trim());
    res.status(201).json(comment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '..', 'frontend', 'build');
  app.use(express.static(clientBuildPath));

  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Server startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
