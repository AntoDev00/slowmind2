const { getQuotes, getQuoteOfTheDay } = require('../db');

const getAllQuotes = async (req, res) => {
  try {
    const quotes = await getQuotes();
    return res.json(quotes);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getDailyQuote = async (req, res) => {
  try {
    const quote = await getQuoteOfTheDay();
    return res.json(quote);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllQuotes,
  getDailyQuote
};
