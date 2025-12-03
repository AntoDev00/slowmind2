const express = require('express');
const authenticate = require('../middleware/auth');
const { getMe, updateProfile } = require('../controllers/userController');

const router = express.Router();

router.get('/users/me', authenticate, getMe);
router.put('/users/:id', authenticate, updateProfile);

module.exports = router;
