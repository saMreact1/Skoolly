const express = require('express');
const router = express.Router();
const { saveTimetable, getTimetable } = require('../controllers/timetable.controller');
const { authMiddleware } = require('../middlewares/auth.middleware');

router.post('/', authMiddleware, saveTimetable);
router.get('/:classId', authMiddleware, getTimetable);

// router.post('/save', /*authMiddleware,*/ saveTimetable);
// router.post('/get',  /*authMiddleware,*/ getTimetable);


module.exports = router;
