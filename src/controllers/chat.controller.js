// controller/chat.controller.js
const User = require('../models/User');
const Conversation = require('../models/Conversation');
const Message = require('../models/Message');


exports.getRoleList = (role) => async (req, res) => {
  const page  = +req.query.page  || 1;
  const limit = +req.query.limit || 30;
  const skip  = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find({ role })
        .select('name avatar city country')
        .skip(skip).limit(limit).lean(),
    User.countDocuments({ role })
  ]);
  res.json({ status: true, data: { users, total, page } });
};



exports.getUsers    = exports.getRoleList('user');
exports.getArtists  = exports.getRoleList('artist');
exports.getOrganizers = exports.getRoleList('organizer');