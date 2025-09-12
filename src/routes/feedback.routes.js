const router = require('express').Router();
const authMiddleware = require('../middlewares/auth'); ;
const { submitFeedback } = require('../controllers/feedback.controller');

router.use(authMiddleware);               
router.post('/submit-Feedback', submitFeedback);        

module.exports = router;