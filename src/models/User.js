const mongoose = require('mongoose');

const Roles = ['artist', 'organizer', 'user'];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, sparse: true, unique: true, lowercase: true, trim: true, },
    role: { type: String, enum: Roles, default: 'user', },
    isPhoneVerified: { type: Boolean, default: false, },
    isEmailVerified: { type: Boolean, default: false, },
    deleteRequestedAt: { type: Date },
    
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);


module.exports = { User, Roles };