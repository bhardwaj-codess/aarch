router.get('/:role(users|artists|organisers)', authMiddleware, chatCtrl.getRoleList);
router.get('/room/:userId', authMiddleware, chatCtrl.getOrCreateRoom);
router.get('/room/:roomId/history', authMiddleware, chatCtrl.getHistory);