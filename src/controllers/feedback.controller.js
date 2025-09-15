const Feedback = require('../models/Feedback');

exports.submitFeedback = async (req, res) => {
  try {
    const { rating, comment = '' } = req.body;

    if (rating === undefined || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Rating must be between 0 and 5' });
    }
    if (!Number.isFinite(rating) || (rating * 2) % 1 !== 0) { // 0.5 step
      return res.status(400).json({ message: 'Rating must be in 0.5 steps (e.g. 3.5)' });
    }

    const feedback = await Feedback.findOneAndUpdate(
      { userId: req.user.uid },               
      { rating, comment },                    
      { new: true, upsert: true }             
    );

    return res.status(200).json({
      status: true,
      message: feedback.wasNew ? 'Feedback created' : 'Feedback updated',
      data: feedback
    });
  } catch (err) {
    console.error('Feedback error:', err);
    return res.status(500).json({ status: false, message: 'Failed to save feedback' });
  }
};