// const mongoose = require('mongoose');

// const Roles = ['artist', 'organizer', 'user'];

// const userSchema = new mongoose.Schema(
//   {
//     phone: {
//       type: String,
//       required: true,
//       unique: true,
//       trim: true,
//     },
//     role: {
//       type: String,
//       enum: Roles,
//       default: 'user',
//     },
//     otpHash: {
//       type: String,
//     },
//     otpExpiresAt: {
//       type: Date,
//     },
//     isPhoneVerified: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );

// userSchema.index({ phone: 1 }, { unique: true });
// userSchema.index({ otpExpiresAt: 1 }, { expireAfterSeconds: 0, partialFilterExpression: { otpExpiresAt: { $exists: true } } });

// const User = mongoose.model('User', userSchema);

// module.exports = { User, Roles };



const mongoose = require('mongoose');

const Roles = ['artist', 'organizer', 'user'];



const userSchema = new mongoose.Schema(
  {
    email: { type: String, sparse: true, unique: true, lowercase: true, trim: true, },
    role: { type: String, enum: Roles, default: 'user', },
    isPhoneVerified: { type: Boolean, default: false, },
    isEmailVerified: { type: Boolean, default: false, },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);


module.exports = { User, Roles };