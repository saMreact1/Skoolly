const express = require('express');
const router = express.Router();
const classController = require('../controllers/class.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

// Protect all class routes
// router.use(authMiddleware);

router.post('/', authMiddleware, classController.createClass);
router.get('/', authMiddleware, classController.getClasses);
router.get('/tenant/:tenantId', classController.getClassesByTenantId);
// router.get('/:id', classController.getClassById);
// router.put('/:id', classController.updateClass);
// router.delete('/:id', classController.deleteClass);

module.exports = router;
