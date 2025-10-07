const mongoose = require('mongoose');

const appUserSchema = new mongoose.Schema(
  {
    userId:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },

    name:    { type: String, required: true, trim: true },
    number:  { type: String, trim: true, default: '' },
    address: { type: String, trim: true },

    image:   { type: String, trim: true }
  },
  { timestamps: true }          
);

module.exports = mongoose.models.AppUser || mongoose.model('AppUser', appUserSchema);