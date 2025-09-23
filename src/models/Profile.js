const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    name: { type: String, trim: true, required: true },
    desc: { type: String, trim: true }, // description
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    time: { type: Number, required: true }, // in hours or whatever unit you prefer
    category: { type: String, trim: true },
    price: { type: Number, required: true },
    image: { type: String }, // assuming it's a URL or path to image





    // bandName: { type: String, trim: true, required: true },
    // availability: { type: String, trim: true, required: true },
    // time: { type: String, trim: true , required: true },
    // distance: { type: String, trim: true },
    // about: { type: String, trim: true },
    // portfolio: { type: String, trim: true },
    // location: { type: String, trim: true }
  },
  { timestamps: true }
);

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;

