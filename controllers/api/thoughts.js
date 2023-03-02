const router = require('express').Router();
const { User, Thought } = require('../../models');


// GET all thoughts
router.get('/', async (req, res) => {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve thoughts' });
  }
});

// GET a single thought by its _id and populated thought and friend data
router.get('/:id', async (req, res) => {
  try {
    const thought = await Thought.findById(req.params.id)

    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to retrieve thought' });
  }
});

// POST a new thought
router.post('/', async (req, res) => {
  try {
    const thought = await Thought.create(req.body);
    const user = await User.findOneAndUpdate({
       username:req.body.username
      }, {
        $addToSet:{
            thoughts:thought._id
        }
      }, {
        new: true,
        runValidators: true
      });
    res.status(201).json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create thought' });
  }
});

// PUT to update a thought by its _id
router.put('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update thought' });
  }
});

// DELETE to remove thought by its _id
router.delete('/:id', async (req, res) => {
  try {
    const thought = await Thought.findByIdAndDelete(req.params.id);
    if (!thought) {
      return res.status(404).json({ error: 'Thought not found' });
    }
    res.json(thought);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete thought' });
  }
});

module.exports = router;
