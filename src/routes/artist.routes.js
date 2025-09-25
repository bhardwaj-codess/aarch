const router = require('express').Router();
const ctrl = require('../controllers/artist.controller');
const auth = require('../middlewares/auth');   // your JWT middleware

router.post('/create-artist',     auth, ctrl.createArtist);      // POST   /artists
router.post('/edit-artist',    auth, ctrl.updateArtist);      // PUT    /artists/me
router.get('/me',    auth, ctrl.getMyArtist);       // GET    /artists/me
router.get('/artists',    ctrl.listArtists);
router.get('/:id',       ctrl.getArtistById);  // GET    /artists/:id



module.exports = router;