const AppUser = require('../models/AppUser');
const path = require('path');
const fs = require('fs');
const { User } = require('../models/User');

// Create AppUser Profile
exports.createAppUser = async (req, res) => {
  try {
    const userId = req.user.uid;

    const exists = await AppUser.exists({ userId });
    if (exists) return res.status(409).json({ status: false, message: 'AppUser profile already exists' });

    const imageUrl = req.file ? req.file.path : '';

    const profile = await AppUser.create({ ...req.body, userId, image: imageUrl });
    return res.status(201).json({ status: true, data: profile });
  } catch (error) {
    console.error('createAppUser:', error);
    return res.status(500).json({ status: false, message: error.message, stack: error.stack });
  }
};

// Update AppUser Profile
exports.updateAppUser = async (req, res) => {
  try {
    const userId = req.user.uid;
    const existing = await AppUser.findOne({ userId });
    if (!existing) return res.status(404).json({ status: false, message: 'AppUser profile not found' });

    const updateData = { ...req.body };
    if (req.file) updateData.image = req.file.path;

    const updated = await AppUser.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true });

    if (req.file && existing.image && existing.image.startsWith(path.join(process.cwd(), 'uploads'))) {
      fs.unlink(existing.image, () => {});
    }

    return res.json({ status: true, data: updated });
  } catch (e) {
    console.error('updateAppUser:', error);
    return res.status(500).json({ status: false, message: error.message, stack: error.stack });
  }
};

// Get My AppUser Profile
exports.getMyAppUser = async (req, res) => {
  const profile = await AppUser.findOne({ userId: req.user.uid }).lean();
  if (!profile) return res.status(404).json({ message: 'AppUser profile not found' });
  res.json({ status: true, data: profile });
};

// Get AppUser by ID
exports.getAppUserById = async (req, res) => {
  const profile = await AppUser.findById(req.params.id).populate('userId', 'email -_id');
  if (!profile) return res.status(404).json({ message: 'AppUser not found' });
  res.json({ status: true, data: profile });
};

// List AppUsers with pagination
exports.listAppUsers = async (req, res) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip  = (page - 1) * limit;

    const pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      { $lookup: { from: 'users', localField: 'userId', foreignField: '_id', as: 'u' } },
      { $unwind: '$u' },
      { $project: { _id: 0, id: '$_id', name: 1, number: 1, address: 1, image: 1, createdAt: 1, email: '$u.email' } }
    ];

    const [users, total] = await Promise.all([AppUser.aggregate(pipeline), AppUser.countDocuments()]);
    res.json({ status: true, data: { users, total, page, pages: Math.ceil(total / limit) } });
  } catch (e) {
    res.status(500).json({ status: false, message: e.message });
  }
};