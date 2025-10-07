const mongoose = require('mongoose');

const artistSchema = new mongoose.Schema(
  {
    userId:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true, required: true },
    name:         { type: String, required: true, trim: true },        
    mobileNumber: { type: String, required: true, trim: true },        
    stageName:    { type: String, required: true, trim: true },        
    description:  { type: String, max: 1000 },                         
    category:     { type: String, required: true, trim: true },        
    price:        { type: Number, required: true },                     
    gender:       { 
      type: String, 
      enum: ['male', 'female', 'other'], 
      required: true 
    },
    socials: {                                                   
      instagram: String,
      spotify:   String,
      youtube:   String
    },
    image: { type: String, trim: true } 
  },
  { timestamps: true }
);

const Artist = mongoose.models.Artist || mongoose.model('Artist', artistSchema);

module.exports = Artist;
