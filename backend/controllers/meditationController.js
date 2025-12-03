const {
  createMeditationSession,
  getMeditationSessionsByUser,
  deleteMeditationSession
} = require('../db');

const createSession = async (req, res) => {
  try {
    const { duration, type, notes } = req.body;

    if (!duration) {
      return res.status(400).json({ message: 'Duration is required' });
    }

    const session = await createMeditationSession(req.user.id, { duration, type, notes });
    return res.status(201).json({ message: 'Meditation session recorded', session });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const getSessions = async (req, res) => {
  try {
    const sessions = await getMeditationSessionsByUser(req.user.id);
    return res.json(sessions);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const deleteSession = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await deleteMeditationSession(req.user.id, id);

    if (!deleted) {
      return res.status(404).json({ message: 'Session not found' });
    }

    return res.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createSession,
  getSessions,
  deleteSession
};
