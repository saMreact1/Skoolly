const router = require('express').Router();
const { getOverview, getClassCounts } = require('../controllers/admin.controller');
const { authMiddleware } = require('../middlewares/auth.middleware')

router.get('/overview', authMiddleware, getOverview);
router.get('/class-count', authMiddleware, getClassCounts);


module.exports = router;