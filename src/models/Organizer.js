const mongoose = require('mongoose');

const organizerSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    companyName: { type: String, required: true, trim: true },
    companyInfo: { type: String, max: 1000 },          
    contactNumber: { type: String, required: true, trim: true },
    address: { type: String, trim: true },

    socialMedia: {
      instagram: String,
      facebook:  String,
      twitter:   String,
      linkedin:  String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Organizer', organizerSchema);

