const Organizer = require('../models/Organizer');
const mongoose  = require('mongoose');

// creatreOrganizer Profile
exports.createOrganizer = async (req, res) => {
  try {
    // if (req.user.role !== 'organizer')
    //   return res.status(403).json({ status: false, message: 'Only organizer role can create profile' });

    const userId = req.user.uid;
    if (await Organizer.exists({ userId }))
      return res.status(409).json({ status: false, message: 'Profile already exists' });

    const doc = await Organizer.create({ ...req.body, userId });
    res.status(201).json({ status: true, data: doc });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

// editOrganizer Profile
exports.updateOrganizer = async (req, res) => {
  try {
    const doc = await Organizer.findOneAndUpdate(
      { userId: req.user.uid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!doc) return res.status(404).json({ status: false, message: 'Profile not found' });
    res.json({ status: true, data: doc });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

// getMyOrganizer Profile
exports.getMyOrganizer = async (req, res) => {
  const doc = await Organizer.findOne({ userId: req.user.uid });
  if (!doc) return res.status(404).json({ status: false, message: 'Profile not found' });
  res.json({ status: true, data: doc });
};

// getOrganizer by ID
exports.getOrganizerById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ status: false, message: 'Invalid ID' });

  const doc = await Organizer.findById(req.params.id).populate('userId', 'email -_id');
  if (!doc) return res.status(404).json({ status: false, message: 'Not found' });
  res.json({ status: true, data: doc });
};


exports.listOrganizers = async (req, res) => {
  try {
    const page  = Math.max(parseInt(req.query.page)  || 1, 1);
    const limit = Math.min(parseInt(req.query.limit) || 20, 100);
    const skip  = (page - 1) * limit;

    const pipeline = [
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'u'
        }
      },
      { $unwind: '$u' },
      {
        $project: {
          _id: 0,
          id: '$_id',
          companyName: 1,
          companyInfo: 1,
          contactNumber: 1,
          address: 1,
          socialMedia: 1,
          createdAt: 1,
          email: '$u.email'
        }
      }
    ];

    const [organizers, total] = await Promise.all([
      Organizer.aggregate(pipeline),
      Organizer.countDocuments()
    ]);

    res.json({ status: true, data: { organizers, total, page, pages: Math.ceil(total / limit) } });
  } catch (e) {
    res.status(500).json({ status: false, message: e.message });
  }
};