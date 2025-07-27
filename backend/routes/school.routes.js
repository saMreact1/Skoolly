const express = require('express');
const router = express.Router();
const { createSchool, getSchool, getSchoolByName } = require('../controllers/school.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, createSchool);
router.get('/', authMiddleware, getSchool);
router.get('/name/:name', getSchoolByName);


module.exports = router;
