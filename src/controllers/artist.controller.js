const Artist = require('../models/Artist');
const cloudinary = require('../config/cloudinary');
const path = require('path');
const mongoose  = require('mongoose');
const { User } = require('../models/User');

// creatreArtist Profile
exports.createArtist = async (req, res) => {
  try {
    // console.log('req.file:', req.file);   
    // console.log('req.body:', req.body); 

    const userId = req.user.uid;

    const exists = await Artist.exists({ userId });
    if (exists) 
      return res.status(409).json({ status: false, message: 'Artist profile already exists' });

    let imageUrl = '';

    if (req.file) {
      try {
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: 'artists',
          public_id: req.body.stageName.replace(/\s+/g, '_').toLowerCase(),
          overwrite: true,
          unique_filename: false, 
          resource_type: 'image',
          tags: [`user_${userId}`, `artist_${req.body.stageName}`],
          context: `userId=${userId}|stageName=${req.body.stageName}`
        });

        imageUrl = result.secure_url;

      } catch (cloudErr) {
        console.warn('Cloudinary upload failed, falling back to local storage:', cloudErr.message);
        imageUrl = req.file.path || path.join(process.cwd(), 'uploads', req.file.filename);
      }
    }

    const artist = await Artist.create({
      ...req.body,   
      userId,        
      image: imageUrl
    });

    return res.status(201).json({ status: true, data: artist });

  } catch (error) {
    console.error('ERROR:', error);              
    return res.status(500).json({   
      status: false,
      message: error.message || error.toString(),
      stack: error.stack
    });
  }
};

// updateArtist Profile
exports.updateArtist = async (req, res) => {
  try {
    // console.log('updateArtist req.file:', req.file);
    // console.log('updateArtist req.body:', req.body);

    const userId = req.user.uid;

    // Ensure artist exists
    const existing = await Artist.findOne({ userId });
    if (!existing) return res.status(404).json({ status: false, message: 'Artist profile not found' });

    // Build update payload
    const updateData = { ...req.body };
    if (req.file) {
      updateData.image = req.file.path || req.file.location || req.file.secure_url || '';
      if (!updateData.image && req.file.filename) {
        const path = require('path');
        updateData.image = path.join(process.cwd(), 'uploads', req.file.filename);
      }
    }

    // Update document
    const artist = await Artist.findOneAndUpdate({ userId }, updateData, { new: true, runValidators: true });

    try {
      if (req.file && req.file.path && existing.image) {
        const path = require('path');
        const fs = require('fs');
        const uploadsDir = path.join(process.cwd(), 'uploads');
        if (existing.image.startsWith(uploadsDir)) {
          fs.unlink(existing.image, (err) => {
            if (err) console.warn('Failed to delete old image:', err.message);
            else console.log('Deleted old image:', existing.image);
          });
        }
      }
    } catch (cleanupErr) {
      console.warn('Error during image cleanup:', cleanupErr && cleanupErr.message ? cleanupErr.message : cleanupErr);
    }

    return res.json({ status: true, data: artist });
  } catch (error) {
    console.error('ERROR updateArtist:', error);
    return res.status(500).json({ status: false, message: error.message || error.toString(), stack: error.stack });
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

// List artists 
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