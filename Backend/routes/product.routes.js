const express = require('express');
const router = express.Router();
const upload = require('../middlewares/upload');
const {
  addProduct,
  getAllProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getShopProducts, 
} = require('../controllers/product.controller');

const isAdmin = require('../middlewares/admin');

// ✅ Public Route: Shop Page Products
router.get('/shop', getShopProducts);

// ✅ Admin Routes
router.post('/add', isAdmin, upload.single('image'), addProduct);
router.get('/', getAllProducts);
router.get('/:id', isAdmin, getProductById);
router.put('/:id', isAdmin, upload.single('image'), updateProduct);
router.delete('/:id', isAdmin, deleteProduct);

module.exports = router;
