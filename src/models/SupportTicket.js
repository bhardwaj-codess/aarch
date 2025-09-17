const { Schema, model } = require('mongoose');

const ticketSchema = new Schema(
  {
    userId:        { type: Schema.Types.ObjectId, ref: 'User', required: true },

    issueFaced:    { 
      type: String, 
      enum: ['login-problem', 'payment-issue', 'bug-report', 'feature-request', 'other'], 
      required: true,
      default: 'other' 
    },

    subject:       { type: String, required: true, trim: true, maxlength: 120 },
    description:   { type: String, required: true, trim: true, maxlength: 2000 },

    status:        { type: String, enum: ['Pending', 'Reverted', 'closed'], default: 'Pending' },
    priority:      { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    adminNotes:    { type: String, default: '' },
    closedAt:      Date
  },
  { timestamps: true }
);

module.exports = model('SupportTicket', ticketSchema);
