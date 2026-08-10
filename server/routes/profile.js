const router = require('express').Router();
const auth = require('../middleware/auth');
const Profile = require('../models/Profile');

router.get('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    res.json(profile);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

router.put('/', auth, async (req, res) => {
  try {
    const { name, degree, year, academicBackground, skills, interests, careerGoals, preferredAreas } = req.body;
    const profile = await Profile.findOneAndUpdate(
      { user: req.user._id },
      { name, degree, year, academicBackground, skills, interests, careerGoals, preferredAreas },
      { new: true, upsert: true, runValidators: true }
    );
    res.json(profile);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
