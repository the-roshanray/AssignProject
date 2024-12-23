const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  deadline: { type: Date, required: true },
});

module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);
