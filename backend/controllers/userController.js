const { getUserById, updateUser } = require('../db');

const getMe = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    return res.json(user);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

const updateProfile = async (req, res) => {
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

    return res.json(updatedUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getMe,
  updateProfile
};
