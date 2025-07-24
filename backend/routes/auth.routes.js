const router = require('express').Router();
const { register, login, checkSchoolAndEmail, forgotPassword, resetPassword } = require('../controllers/auth.controller');

router.post('/register', register);
router.post('/login', login);
router.post('/check', checkSchoolAndEmail);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);


module.exports = router;
