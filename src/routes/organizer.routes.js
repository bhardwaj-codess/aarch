const router = require('express').Router();
const ctrl   = require('../controllers/organizer.controller');
const auth = require('../middlewares/auth'); 
const parser = require('../middlewares/upload')('organizers');

router.post('/create-organizer',     auth, parser.single('image'), ctrl.createOrganizer);
router.post('/edit-organizer',    auth, parser.single('image'), ctrl.updateOrganizer);
router.get('/me',    auth, ctrl.getMyOrganizer);
router.get('/organizers', ctrl.listOrganizers);
router.get('/:id',            ctrl.getOrganizerById);

module.exports = router;