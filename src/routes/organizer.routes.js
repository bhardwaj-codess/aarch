const router = require('express').Router();
const ctrl   = require('../controllers/organizer.controller');
const auth = require('../middlewares/auth'); 

router.post('/create-organizer',     auth, ctrl.createOrganizer);
router.put('/edit-organizer',    auth, ctrl.updateOrganizer);
router.get('/me',    auth, ctrl.getMyOrganizer);
router.get('/organizers', ctrl.listOrganizers);
router.get('/:id',            ctrl.getOrganizerById);

module.exports = router;