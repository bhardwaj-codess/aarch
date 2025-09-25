const Booking = require('../models/booking');
// const Artist  = require('../models/artist');
const Organizer = require('../models/organizer');

/* ----------------------------------------------------------
   helper: convert role string → mongoose model
---------------------------------------------------------- */
const roleModel = (role) =>
  role === 'artist' ? Artist : role === 'organizer' ? Organizer : null;

/* ===============================5.  -===========================
   POST /bookings   (everyone can book)
   body: {
     targetType: "artist" | "organizer",
     targetId:   ObjectId (artist _id or organizer _id),
     eventType, eventDate, location, price, description, ...
   }
   ========================================================== */
exports.createBooking = async (req, res) => {
  try {
    const { targetType, targetId, eventType, eventDate, location, price, description } = req.body;

    if (!['artist', 'organizer'].includes(targetType))
      return res.status(400).json({ status: false, message: 'targetType must be artist or organizer' });

    const TargetModel = roleModel(targetType);
    const targetProfile = await TargetModel.findById(targetId).populate('userId');
    if (!targetProfile)
      return res.status(404).json({ status: false, message: `${targetType} profile not found` });

    const booking = await Booking.create({
      bookedBy:      req.user.uid,
      bookedByModel: req.user.role,          // artist / organizer / user
      bookedTarget:  targetId,
      targetModel:   targetType,
      targetUserId:  targetProfile.userId._id,
      eventType, eventDate, location, price, description,
      currency: req.body.currency || 'INR'
    });

    res.status(201).json({ status: true, data: booking });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

/* ==========================================================
   PATCH /bookings/:id/respond
   body: { status: "accepted" | "rejected" }
   Only the *target* can accept/reject.
   ========================================================== */
exports.respondBooking = async (req, res) => {
  try {
    const { status } = req.body;               // accepted / rejected
    if (!['accepted', 'rejected'].includes(status))
      return res.status(400).json({ status: false, message: 'Invalid status' });

    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ status: false, message: 'Booking not found' });

    // caller must be the owner of the target profile
    if (!booking.targetUserId.equals(req.user.uid))
      return res.status(403).json({ status: false, message: 'Not authorized to respond' });

    if (booking.status !== 'requested')
      return res.status(400).json({ status: false, message: `Already ${booking.status}` });

    booking.status = status;
    booking.respondedAt = new Date();
    await booking.save();

    res.json({ status: true, data: booking });
  } catch (e) {
    res.status(400).json({ status: false, message: e.message });
  }
};

/* ==========================================================
   GET /bookings/incoming   (what others requested from me)
   GET /bookings/outgoing   (what I requested from others)
   ========================================================== */
exports.getIncoming = async (req, res) => {
  const list = await Booking.find({ targetUserId: req.user.uid })
                            .populate('bookedBy', 'email role')
                            .populate('bookedTarget')
                            .sort({ createdAt: -1 });
  res.json({ status: true, data: list });
};

exports.getOutgoing = async (req, res) => {
  const list = await Booking.find({ bookedBy: req.user.uid })
                            .populate('targetUserId', 'email role')
                            .populate('bookedTarget')
                            .sort({ createdAt: -1 });
  res.json({ status: true, data: list });
};

/* ==========================================================
   GET /bookings/:id   (single detail)
   ========================================================== */
exports.getById = async (req, res) => {
  const booking = await Booking.findById(req.params.id)
                               .populate('bookedBy', 'email role')
                               .populate('targetUserId', 'email role')
                               .populate('bookedTarget');
  if (!booking) return res.status(404).json({ status: false, message: 'Not found' });

  // allow only the two parties involved
  const allowed = [booking.bookedBy.toString(), booking.targetUserId.toString()];
  if (!allowed.includes(req.user.uid))
    return res.status(403).json({ status: false, message: 'Access denied' });

  res.json({ status: true, data: booking });
};