const express = require('express');
const router = express.Router();
const { signup, login, logout, dashboard } = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.get('/dashboard', dashboard);

module.exports = router;