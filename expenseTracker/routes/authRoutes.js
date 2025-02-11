// routes/authRoutes.js
const express = require('express');
const { register, login, getUserById, updateUser, deleteUser } = require('../controllers/authController');
const { hello } = require('../controllers/helloController');
const verifyToken = require('../middleware/auth');

const router = express.Router();

// Route for user registration (POST /register)
router.post('/register', register);

// Route for user login (POST /logon)
router.post('/logon', login);

// Protected route (GET /hello)
router.get('/hello', verifyToken, hello);

//get user by Id
router.get('/user/:id', verifyToken, getUserById);

//upsate user
router.put('/user/:id', verifyToken, updateUser);

//delete user
router.delete("/user/:id", verifyToken, deleteUser);

module.exports = router;
