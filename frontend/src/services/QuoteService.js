// Service for managing motivational quotes and daily rotation
import apiClient from './apiClient';

const QuoteService = {
  // Collection of motivational quotes
  quotes: [
    { id: 1, text: "Breathe in peace, breathe out tension." },
    { id: 2, text: "The present moment is the only moment available to us." },
    { id: 3, text: "Peace comes from within. Do not seek it without." },
    { id: 4, text: "Quiet the mind, and the soul will speak." },
    { id: 5, text: "Meditation is the soul's perspective glass." },
    { id: 6, text: "Your calm mind is the ultimate weapon against your challenges." },
    { id: 7, text: "Mindfulness isn't difficult. We just need to remember to do it." },
    { id: 8, text: "The best way to capture moments is to pay attention." },
    { id: 9, text: "Breathing in, I calm body and mind. Breathing out, I smile." },
    { id: 10, text: "Within you, there is a stillness and a sanctuary to which you can retreat at any time." },
    { id: 11, text: "Be here now. Be someplace else later. Is that so complicated?" },
    { id: 12, text: "Meditation and concentration are the way to a life of serenity." },
    { id: 13, text: "The quieter you become, the more you can hear." },
    { id: 14, text: "To understand the immeasurable, the mind must be extraordinarily quiet." },
    { id: 15, text: "Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor." }
  ],
  
  // Get quote of the day - changes only once per day
  getQuoteOfTheDay: async () => {
    try {
      // First, check if we should fetch from the backend
      try {
        const response = await apiClient.get('/api/quotes/daily');
        if (response.data && response.data.text) {
          return response.data;
        }
      } catch (error) {
        console.log('Could not fetch quote from API, using local quotes instead');
        // If API fails, fall back to local quotes
      }
      
      // Check if we have a stored quote for today
      const storedQuote = localStorage.getItem('dailyQuote');
      const storedDate = localStorage.getItem('dailyQuoteDate');
      
      if (storedQuote && storedDate) {
        const today = new Date().toDateString();
        // If the stored quote is from today, return it
        if (storedDate === today) {
          return JSON.parse(storedQuote);
        }
      }
      
      // Otherwise, get a new quote for today
      return QuoteService.setNewDailyQuote();
    } catch (error) {
      console.error('Error getting quote of the day:', error);
      // Return a default quote if everything fails
      return { 
        id: 0, 
        text: "Mindfulness is about being fully awake in our lives."
      };
    }
  },
  
  // Set a new daily quote
  setNewDailyQuote: () => {
    // Get today's date as string
    const today = new Date().toDateString();
    
    // Use the date to seed a simple random number generator for consistent daily quote
    const seed = today.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    const randomIndex = seed % QuoteService.quotes.length;
    
    const quote = QuoteService.quotes[randomIndex];
    
    // Store the quote and date
    localStorage.setItem('dailyQuote', JSON.stringify(quote));
    localStorage.setItem('dailyQuoteDate', today);
    
    return quote;
  },
  
  // Get all available quotes (for admin or settings)
  getAllQuotes: async () => {
    try {
      // Try to get quotes from backend first
      const response = await apiClient.get('/api/quotes');
      if (response.data && response.data.length > 0) {
        return response.data;
      }
      return QuoteService.quotes;
    } catch (error) {
      console.error('Error fetching all quotes:', error);
      return QuoteService.quotes;
    }
  }
};

export default QuoteService;
