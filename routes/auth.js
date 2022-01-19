const express = require('express');

const {
  registerUser,
  loginUser,
  forgotPassword,
  resetPassword,
} = require('./../controllers/authController');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

module.exports = router;
