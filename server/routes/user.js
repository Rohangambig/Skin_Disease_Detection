const express = require('express');
const router = express.Router();
const { signup, login, doctorLogin,doctorSignup } = require('../controllers/user');

router.post('/signup', signup);
router.post('/login', login);
router.post('/doctor-login', doctorLogin);
router.post('/doctor-signup',doctorSignup );

module.exports = router;