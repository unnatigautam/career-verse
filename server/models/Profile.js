const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  name: { type: String, default: '' },
  degree: { type: String, default: '' },
  year: { type: String, default: '' },
  academicBackground: { type: String, default: '' },
  skills: [{ type: String }],
  interests: [{ type: String }],
  careerGoals: { type: String, default: '' },
  preferredAreas: [{ type: String }],
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
