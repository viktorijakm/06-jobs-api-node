// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { hello } = require('../controllers/helloController');
const verifyToken = require('../middleware/auth');

// Route for user registration (POST /register)
router.post('/register', register);

// Route for user login (POST /logon)
router.post('/logon', login);

// Protected route (GET /hello)
router.get('/hello', verifyToken, hello);

module.exports = router;
