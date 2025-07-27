const express = require('express');
const router = express.Router();
const { createSession, getSessions } = require('../controllers/session.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, createSession);
router.get('/', authMiddleware, getSessions);


module.exports = router;
