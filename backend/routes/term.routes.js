const express = require('express');
const router = express.Router();
const { createTerm, getTerms } = require('../controllers/term.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, createTerm);
router.get('/', authMiddleware, getTerms);


module.exports = router;
