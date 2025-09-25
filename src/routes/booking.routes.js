const router = require('express').Router();
const ctrl   = require('../controllers/booking');
const auth   = require('../middleware/auth');

router.post('/',                auth, ctrl.createBooking);      // create
router.patch('/:id/respond',    auth, ctrl.respondBooking);     // accept/reject
router.get('/incoming',         auth, ctrl.getIncoming);        // received
router.get('/outgoing',         auth, ctrl.getOutgoing);        // sent
router.get('/:id',              auth, ctrl.getById);            // single detail

module.exports = router;