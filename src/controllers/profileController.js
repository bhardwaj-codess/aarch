const Profile = require('../models/Profile');


async function UpdateProfile(req, res) {
  try {
    const userId = req.user && req.user.uid;
    if (!userId) return res.status(401).json({ message: 'Unauthorized', success: false });

    const { bandName, availability, time, distance, about, portfolio, location } = req.body;

    // Validate bandName uniqueness
    if (bandName) {
      const existingBand = await Profile.findOne({ bandName, userId: { $ne: userId } });
      if (existingBand) {
        return res.status(400).json({
          message: 'Band name already exists',
          success: false
        });
      }
    }

    let profile = await Profile.findOne({ userId });

    if (!profile) {
      // create new profile
      profile = await Profile.create({
        userId,
        bandName,
        availability,
        time,
        distance,
        about,
        portfolio,
        location
      });
    } else {
      // update profile
      profile.bandName = bandName;
      profile.availability = availability;
      profile.time = time;
      profile.distance = distance;
      profile.about = about;
      profile.portfolio = portfolio;
      profile.location = location;
      await profile.save();
    }

    return res.status(200).json({
      message: 'Profile saved successfully',
      success: true,
      data: profile
    });

  } catch (err) {
    console.error('Profile save error:', err);
    return res.status(500).json({ success: false, message: 'Failed to save profile' });
  }
}


// Get own profile
async function getMyProfile(req, res) {
  try {
    const userId = req.user && req.user.uid;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    return res.status(200).json({ success:true, data: profile });
  } catch (err) {
    console.error('Get profile error:', err);
    return res.status(500).json({ success:false, message: 'Failed to fetch profile' });
  }
}

// Get profile by userId (public)
async function getProfileByUserId(req, res) {
  try {
    const { userId } = req.params;
    const profile = await Profile.findOne({ userId });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    return res.status(200).json({ success:true, data: profile });
  } catch (err) {
    console.error('Get profile by userId error:', err);
    return res.status(500).json({ success:false, message: 'Failed to fetch profile' });
  }
}

module.exports = { UpdateProfile, getMyProfile, getProfileByUserId };
