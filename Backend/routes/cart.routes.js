const express = require('express');
const router = express.Router();

const {
  addToCart,
  getUserCart,
  removeFromCart,
  clearCart,
} = require('../controllers/cart.controller');

const { authenticateCartUser } = require('../middlewares/cart.auth');

// ✅ Add to cart
router.post('/add', authenticateCartUser, addToCart);

// ✅ Get user cart
router.get('/', authenticateCartUser, getUserCart);

// ✅ Remove from cart
router.delete(
  '/remove/:productId/:productModel',
  authenticateCartUser,
  removeFromCart
);

// routes/cart.route.js
router.delete('/clear', authenticateCartUser, clearCart);

module.exports = router;
