const router = require('express').Router();
const ctrl   = require('../controllers/appUser.controller');
const auth   = require('../middlewares/auth');
const parser = require('../middlewares/upload')('appusers');


router.post('/create-appuser',             auth, parser.single('image'), ctrl.createAppUser);
router.post('/edit-appuser',          auth, parser.single('image'), ctrl.updateAppUser);
router.get('/me',            auth, ctrl.getMyAppUser);
router.get('/alluser',              ctrl.listAppUsers); 
router.get('/:id',           ctrl.getAppUserById);

module.exports = router;