const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');


router.post('/', authMiddleware, classController.createClass);
router.get('/', authMiddleware, classController.getClasses);
router.get('/school/:tenantId', classController.getClassesByTenantId);
module.exports = router;
