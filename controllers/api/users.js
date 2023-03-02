const router = require('express').Router();
const { User } = require('../../models');

// GET all users
router.get('/', async (req, res) => {
  try {
    const users = await User.find().populate("thoughts");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve users' });
  }
});

// GET a single user by its _id and populated thought and friend data
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .populate('thoughts')
      .populate('friends');
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve user' });
  }
});

// POST a new user
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// PUT to update a user by its _id
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findOneAndUpdate({
      _id:req.params.id
    }, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

// DELETE to remove user by its _id
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

module.exports = router;
