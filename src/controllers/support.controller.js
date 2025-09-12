const SupportTicket = require('../models/SupportTicket');
// const SupportReply  = require('../models/SupportReply'); 

/* ---------------- create ticket ---------------- */
exports.createTicket = async (req, res) => {
  try {
    const { issueFaced = 'other', subject, description } = req.body;

    if (!issueFaced?.trim() || !subject?.trim() || !description?.trim()) {
      return res.status(400).json({ message: 'Issue Faced, subject and description are required' });
    }

    const ticket = await SupportTicket.create({
      userId: req.user.uid,
      issueFaced,
      subject,
      description
    });

    return res.status(201).json({ status: true, data: ticket });
  } catch (err) {
    console.error('Create ticket error:', err);
    return res.status(500).json({ status: false, message: 'Failed to create ticket' });
  }
};

/* ---------------- list my tickets ---------------- */
exports.getMyTickets = async (req, res) => {
  try {
    const page  = +req.query.page  || 1;
    const limit = +req.query.limit || 10;
    const skip  = (page - 1) * limit;

    const [tickets, total] = await Promise.all([
      SupportTicket.find({ userId: req.user.uid })
                   .select('issueFaced subject status priority createdAt updatedAt')
                   .sort({ createdAt: -1 })
                   .skip(skip).limit(limit)
                   .lean(),
      SupportTicket.countDocuments({ userId: req.user.uid })
    ]);

    return res.json({ 
      status: true, 
      data: { tickets, total, page, pages: Math.ceil(total / limit) } 
    });
  } catch (err) {
    console.error('List tickets error:', err);
    return res.status(500).json({ status: false, message: 'Failed to fetch tickets' });
  }
};

/* ---------------- single ticket ---------------- */
exports.getTicketById = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user.uid
    }).lean();

    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });

    // optional: pull replies
    // const replies = await SupportReply.find({ ticketId: ticket._id })
    //                                   .sort({ createdAt: 1 })
    //                                   .lean();

    return res.json({ status: true, data: { ticket /*, replies */ } });
  } catch (err) {
    console.error('Get ticket error:', err);
    return res.status(500).json({ status: false, message: 'Failed to fetch ticket' });
  }
};

/* ---------------- user reply ---------------- */
exports.addReply = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message?.trim()) return res.status(400).json({ message: 'Message required' });

    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user.uid,
      status: { $ne: 'closed' }
    });
    if (!ticket) return res.status(404).json({ message: 'Ticket not found or closed' });

    const reply = await SupportReply.create({
      ticketId: ticket._id,
      userId:   req.user.uid,
      message
    });

    return res.status(201).json({ status: true, data: reply });
  } catch (err) {
    console.error('Add reply error:', err);
    return res.status(500).json({ status: false, message: 'Failed to add reply' });
  }
};


exports.deleteTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({
      _id: req.params.id,
      userId: req.user.uid,
      status: 'open'               // only open tickets can be self-deleted
    });

    if (!ticket) {
      return res.status(404).json({
        status: false,
        message: 'Ticket not found, already closed, or not yours'
      });
    }

    // optional: also remove replies
    // await SupportReply.deleteMany({ ticketId: ticket._id });

    await ticket.deleteOne();      // or ticket.remove() on older Mongoose
    return res.json({
      status: true,
      message: 'Ticket deleted successfully'
    });
  } catch (err) {
    console.error('Delete ticket error:', err);
    return res.status(500).json({
      status: false,
      message: 'Failed to delete ticket'
    });
  }
};  