const Artist = require('../models/artist');
const mongoose  = require('mongoose');
const User = require('../models/User').User;

// creatreArtist Profile
exports.createArtist = async (req, res) => {
  try {
    // if (req.user.role !== 'artist') {
    //   return res.status(403).json({ status: false, message: 'Only artist role can create artist profile' });
    // }

    const userId = req.user.uid;
    const exists = await Artist.exists({ userId });
    if (exists) return res.status(409).json({ status: false, message: 'Artist profile already exists' });

    const artist = await Artist.create({ ...req.body, userId });
    res.status(201).json({ status: true, data: artist });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

// updateArtist Profile
exports.updateArtist = async (req, res) => {
  try {
    const artist = await Artist.findOneAndUpdate(
      { userId: req.user.uid },
      req.body,
      { new: true, runValidators: true }
    );
    if (!artist) return res.status(404).json({ message: 'Artist profile not found' });
    res.json({ status: true, data: artist });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

// getMyArtist Profile
exports.getMyArtist = async (req, res) => {
  const artist = await Artist.findOne({ userId: req.user.uid }).lean();;
  if (!artist) return res.status(404).json({ message: 'Artist profile not found' });
  res.json({ status: true, data: artist });
};

// getArtist by ID
exports.getArtistById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: 'Invalid ID format' });

  const artist = await Artist.findById(req.params.id).populate('userId', 'email -_id');
  if (!artist) return res.status(404).json({ message: 'Artist not found' });
  res.json({ status: true, data: artist });
};

// List artists with pagination
exports.listArtists = async (req, res) => {
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
          name: 1,
          stageName: 1,
          description: 1,
          category: 1,
          price: 1,
          gender: 1,
          socials: 1,
          createdAt: 1,
          email: '$u.email'
        }
      }
    ];

    const [artists, total] = await Promise.all([
      Artist.aggregate(pipeline),
      Artist.countDocuments()
    ]);

    res.json({ status: true, data: { artists, total, page, pages: Math.ceil(total / limit) } });
  } catch (e) {
    res.status(500).json({ status: false, message: e.message });
  }
};