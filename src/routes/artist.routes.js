const router = require('express').Router();
const ctrl = require('../controllers/artist.controller');
const parser = require('../middlewares/upload')('artists'); 
const auth = require('../middlewares/auth');   // your JWT middleware

router.post('/create-artist',     auth, parser.single('image'), ctrl.createArtist);      // POST   /artists
router.post('/edit-artist',       auth, parser.single('image'), ctrl.updateArtist);      // PUT    /artists/me
router.get('/me',    auth, ctrl.getMyArtist);       // GET    /artists/me
router.get('/artists',    ctrl.listArtists);
router.get('/:id',       ctrl.getArtistById);  // GET    /artists/:id



module.exports = router;


// CLOUDINARY_URL=cloudinary://557965856345841:1AaEr3VrulwCID4qaz3-B5MsSqA@dk2jnxlor