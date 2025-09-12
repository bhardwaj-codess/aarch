const { Schema, model } = require('mongoose');

const feedbackSchema = new Schema(
  {
    userId:  { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    rating:  { type: Number, required: true, min: 0, max: 5 },
    comment: { type: String, trim: true, maxlength: 500 }
  },
  { timestamps: true }
);

module.exports = model('Feedback', feedbackSchema);