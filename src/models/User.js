const mongoose = require('mongoose');

const Roles = ['artist', 'organizer', 'user'];

const userSchema = new mongoose.Schema(
  {
    email: { type: String, sparse: true, unique: true, lowercase: true, trim: true, },
    role: { type: String, enum: Roles, default: 'user', },
    isPhoneVerified: { type: Boolean, default: false, },
    isEmailVerified: { type: Boolean, default: false, },
    deleteRequestedAt: { type: Date },


    login_source: { type: String, default: "" },       // google, facebook, apple
    social_auth: { type: String, default: "" },        // social uid
    os_type: { type: String, default: "" }  
    
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);


module.exports = { User, Roles };