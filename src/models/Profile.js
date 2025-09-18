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




const userProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    
    fullName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    bio: { type: String, trim: true },
    profilePicture: { type: String, trim: true }, // URL to profile image
  },
  { timestamps: true }
);

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile;




const organizerProfileSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },

    companyName: { type: String, trim: true, required: true },
    email: { type: String, trim: true, required: true, unique: true },
    phone: { type: String, trim: true },
    companyId: { type: String, trim: true, required: true, unique: true },
    address: { type: String, trim: true },
    about: { type: String, trim: true },
    website: { type: String, trim: true },
    portfolio: { type: String, trim: true }
  },
  { timestamps: true }
);

const OrganizerProfile = mongoose.model('OrganizerProfile', organizerProfileSchema);
module.exports = OrganizerProfile;
