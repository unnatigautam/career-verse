const router = require('express').Router();
const auth = require('../middleware/auth');
const Recommendation = require('../models/Recommendation');
const Profile = require('../models/Profile');
const { generateCareerRecommendations } = require('../services/aiService');

// POST /api/recommendations — generate new
router.post('/', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user._id });
    if (!profile) return res.status(400).json({ message: 'Complete your profile first.' });

    const careers = await generateCareerRecommendations(profile);
    const rec = await Recommendation.create({
      user: req.user._id,
      careers,
      profileSnapshot: {
        skills: profile.skills,
        interests: profile.interests,
        degree: profile.degree,
        careerGoals: profile.careerGoals,
      },
    });
    res.status(201).json(rec);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to generate recommendations.' });
  }
});

// GET /api/recommendations — list all for user
router.get('/', auth, async (req, res) => {
  try {
    const recs = await Recommendation.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(recs);
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

// DELETE /api/recommendations/:id
router.delete('/:id', auth, async (req, res) => {
  try {
    const rec = await Recommendation.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!rec) return res.status(404).json({ message: 'Not found.' });
    res.json({ message: 'Deleted.' });
  } catch {
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
