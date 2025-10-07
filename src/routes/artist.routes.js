const router = require('express').Router();
const ctrl = require('../controllers/artist.controller');
const parser = require('../middlewares/upload')('artists'); 
const auth = require('../middlewares/auth');  

router.post('/create-artist',     auth, parser.single('image'), ctrl.createArtist);      
router.post('/edit-artist',       auth, parser.single('image'), ctrl.updateArtist);      
router.get('/me',    auth, ctrl.getMyArtist);       
router.get('/artists',    ctrl.listArtists);
router.get('/:id',       ctrl.getArtistById);  



module.exports = router;


