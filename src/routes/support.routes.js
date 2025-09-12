const router = require('express').Router();
const authMiddleware = require('../middlewares/auth');
const { createTicket,   getMyTickets, getTicketById, deleteTicket,  addReply } = require('../controllers/support.controller');
  

// All endpoints require login
router.use(authMiddleware);

router.post('/ticket', createTicket);          // open new ticket
router.get ('/tickets', getMyTickets);        // list my tickets
router.get ('/ticket/:id', getTicketById);
router.delete('/ticket/:id', deleteTicket); 
// router.post('/ticket/:id/reply', addReply);   // user adds message

module.exports = router;