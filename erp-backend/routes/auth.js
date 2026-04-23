const express = require('express');
const router = express.Router();
const { login, registerAdmin } = require('../controllers/authController');

// POST /api/auth/login
router.post('/login', login);

// POST /api/auth/register-admin  (use only ONCE to create your account!)
router.post('/register-admin', registerAdmin);

module.exports = router;