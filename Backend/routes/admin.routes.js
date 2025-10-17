const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin.controller')();
const isAdminLoggedIn = require('../middlewares/admin');
const upload = require('../middlewares/upload');
const { googleAdminLogin } = require('../controllers/admin.google.controller');

// ******** ADMIN ROUTES ********

// Admin Registration Route
router.post(
  '/register',
  upload.single('profileImage'),
  adminController.registerAdmin
);

// Admin Login Route
router.post('/login', adminController.loginAdmin);

// Admin Profile Update Route
router.put(
  '/updateAdminProfile',
  isAdminLoggedIn,
  upload.single('profileImage'),
  adminController.updateAdminProfile
);

// Admin Deletion Route
router.delete(
  '/delete/:id',
  isAdminLoggedIn, 
  adminController.deleteAdmin
);

router.get('/google-login', adminController.googleLoginAdmin);

// Admin Logout (Client must clear token)
router.post('/logout', adminController.logoutAdmin);

module.exports = router;
