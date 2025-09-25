// models/artist.js
const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    name:         { type: String, required: true, trim: true },        // Artist's full name
    mobileNumber: { type: String, required: true, trim: true },        // Mobile number
    stageName:    { type: String, required: true, trim: true },        // Stage name
    description:  { type: String, max: 1000 },                         // Artist description / bio
    category:     { type: String, required: true, trim: true },        // Music category / genre
    price:        { type: Number, required: true },                     // Price / rate
    gender:       { 
      type: String, 
      enum: ['male', 'female', 'other'], 
      required: true 
    },
    socials:      {                                                   
      instagram: String,
      spotify:   String,
      youtube:   String
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Artist', artistSchema);
