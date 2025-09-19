const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    bandName: { type: String, trim: true, required: true },
    availability: { type: String, trim: true, required: true },
    time: { type: String, trim: true , required: true },
    distance: { type: String, trim: true },
    about: { type: String, trim: true },
    portfolio: { type: String, trim: true },
    location: { type: String, trim: true }
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;

