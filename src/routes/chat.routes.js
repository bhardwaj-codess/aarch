// router.get('/:role(users|artists|organisers)', authMiddleware, chatCtrl.getRoleList);
// router.get('/room/:userId', authMiddleware, chatCtrl.getOrCreateRoom);
// router.get('/room/:roomId/history', authMiddleware, chatCtrl.getHistory);



// chat.routes.js
router.get('/:role(users|artists|organizers)', authMiddleware, chatCtrl.getRoleList); // organizers not organisers
router.get('/users',     authMiddleware, chatCtrl.getUsers);
router.get('/artists',   authMiddleware, chatCtrl.getArtists);
router.get('/organizers',authMiddleware, chatCtrl.getOrganizers);