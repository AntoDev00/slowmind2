const express = require('express');
const authenticate = require('../middleware/auth');
const {
  createSession,
  getSessions,
  deleteSession
} = require('../controllers/meditationController');

const router = express.Router();

router.post('/meditations', authenticate, createSession);
router.get('/meditations', authenticate, getSessions);
router.delete('/meditations/:id', authenticate, deleteSession);

module.exports = router;
