const router = require('express').Router();
const { register, login, checkSchoolAndEmail } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/check', checkSchoolAndEmail);


module.exports = router;
