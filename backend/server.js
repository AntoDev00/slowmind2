const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'slow-mind-secret-key';

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'https://antodev00.github.io'],
  credentials: true
}));
app.use(express.json());

// In-memory database for simplicity
// In a real app, you would use a proper database like MongoDB or PostgreSQL
const users = [];
const meditationSessions = [];
const motivationalQuotes = [
  { id: 1, text: "Breathe in peace, breathe out tension." },
  { id: 2, text: "The present moment is the only moment available to us." },
  { id: 3, text: "Peace comes from within. Do not seek it without." },
  { id: 4, text: "Quiet the mind, and the soul will speak." },
  { id: 5, text: "Meditation is the soul's perspective glass." }
];

// Authentication routes
app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Check if user already exists
    if (users.find(user => user.email === email)) {
      return res.status(400).json({ message: 'User already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create new user
    const newUser = {
      id: users.length + 1,
      username,
      email,
      password: hashedPassword,
      createdAt: new Date()
    };
    
    users.push(newUser);
    
    // Generate token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    
    res.status(201).json({ 
      message: 'User registered successfully', 
      token,
      user: { id: newUser.id, username: newUser.username, email: newUser.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = users.find(user => user.email === email);
    
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id, email: user.email, username: user.username },
      JWT_SECRET,
      { expiresIn: '2h' }
    );
    
    res.json({ 
      message: 'Login successful', 
      token,
      user: { id: user.id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

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

// Protected routes
app.get('/api/quotes', authenticate, (req, res) => {
  res.json(motivationalQuotes);
});

// Add a new meditation session
app.post('/api/meditations', authenticate, (req, res) => {
  try {
    const { duration, type, notes } = req.body;
    
    const newSession = {
      id: meditationSessions.length + 1,
      userId: req.user.id,
      duration,
      type,
      notes,
      date: new Date()
    };
    
    meditationSessions.push(newSession);
    
    res.status(201).json({ message: 'Meditation session recorded', session: newSession });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user's meditation sessions
app.get('/api/meditations', authenticate, (req, res) => {
  const userSessions = meditationSessions.filter(session => session.userId === req.user.id);
  res.json(userSessions);
});

// Server startup
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
