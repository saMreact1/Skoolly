const router = require('express').Router();
const { getOverview } = require('../controllers/admin.controller');
const { authMiddleware } = require('../middlewares/auth.middleware')

router.get('/dashboard', authMiddleware, getOverview)


module.exports = router;