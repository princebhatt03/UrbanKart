const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller')();
const isUserLoggedIn = require('../middlewares/user');
const upload = require('../middlewares/upload');

// --------------------------- Test Route ---------------------------
router.get('/', (req, res) => {
  res.send('✅ User API Working');
});

// --------------------------- Registration ---------------------------
router.post(
  '/register',
  upload.single('profileImage'), // Optional image upload
  userController.registerUser
);

// --------------------------- Login ---------------------------
router.post('/login', userController.loginUser);

// --------------------------- Update Profile ---------------------------
router.put(
  '/updateUserProfile',
  isUserLoggedIn,
  upload.single('profileImage'),
  userController.updateUserProfile
);

// --------------------------- Delete User ---------------------------
router.delete('/delete/:id', isUserLoggedIn, userController.deleteUser);

module.exports = router;
