const mongoose = require('mongoose');

const careerPathSchema = new mongoose.Schema({
  title: String,
  matchExplanation: String,
  whySuitable: String,
  skillsToLearn: [String],
  nextSteps: [String],
  matchScore: Number,
});

const recommendationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  careers: [careerPathSchema],
  profileSnapshot: {
    skills: [String],
    interests: [String],
    degree: String,
    careerGoals: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Recommendation', recommendationSchema);
