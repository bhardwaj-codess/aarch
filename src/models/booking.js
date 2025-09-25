const mongoose = require('mongoose');

const BookingTypes = ['artist', 'organizer'];   // target type

const bookingSchema = new mongoose.Schema(
  {
    // who is MAKING the booking
    bookedBy:      { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookedByModel: { type: String, enum: ['user', 'artist', 'organizer'], required: true },

    // who is BEING booked
    bookedTarget:      { type: mongoose.Schema.Types.ObjectId, refPath: 'targetModel', required: true },
    targetModel:       { type: String, enum: BookingTypes, required: true }, // artist || organizer
    targetUserId:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // denormalised for quick lookups

    /* ---------- job details ---------- */
    eventType:    { type: String, required: true }, // wedding, show, collab…
    eventDate:    { type: Date,   required: true },
    location:     { type: String, required: true },
    description:  { type: String, max: 2000 },
    price:        { type: Number, required: true },
    currency:     { type: String, default: 'INR' },

    /* ---------- lifecycle ---------- */
    status: {
      type: String,
      enum: ['requested', 'accepted', 'rejected', 'completed', 'cancelled'],
      default: 'requested'
    },

    /* ---------- optional contract ---------- */
    contractUrl: String,

    /* ---------- timestamps ---------- */
    respondedAt: Date,
    completedAt: Date
  },
  { timestamps: true }
);

/* ------------ indexes for speed ------------ */
bookingSchema.index({ bookedBy: 1, createdAt: -1 });
bookingSchema.index({ targetUserId: 1, status: 1 });

module.exports = mongoose.model('Booking', bookingSchema);