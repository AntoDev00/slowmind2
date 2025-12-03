const express = require('express');
const authenticate = require('../middleware/auth');
const { getAllQuotes, getDailyQuote } = require('../controllers/quoteController');

const router = express.Router();

router.get('/quotes', authenticate, getAllQuotes);
router.get('/quotes/daily', getDailyQuote);

module.exports = router;
