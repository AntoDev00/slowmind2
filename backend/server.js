const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const { PORT, ALLOWED_ORIGINS } = require('./config');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const quoteRoutes = require('./routes/quoteRoutes');
const meditationRoutes = require('./routes/meditationRoutes');
const communityRoutes = require('./routes/communityRoutes');

const app = express();

// Middleware
app.use(cors({
  origin: ALLOWED_ORIGINS,
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', quoteRoutes);
app.use('/api', meditationRoutes);
app.use('/api', communityRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
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
