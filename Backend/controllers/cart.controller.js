const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Shop = require('../models/shop.model');

const MODEL_MAP = {
  Product,
  Shop,
};

const addToCart = async (req, res) => {
  try {
    const { productId, productModel } = req.body;
    const userId = req.user._id;

    if (!['Product', 'Shop'].includes(productModel)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid product model type',
      });
    }

    const Model = MODEL_MAP[productModel];
    const productExists = await Model.findById(productId);
    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: 'Product not found in selected model',
      });
    }

    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
      cart = new Cart({ user: userId, items: [] });
    }

    const existingItem = cart.items.find(
      item =>
        item.productId.toString() === productId &&
        item.productModel === productModel
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        productModel,
        quantity: 1,
      });
    }

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Product added to cart successfully',
      cart,
    });
  } catch (error) {
    console.error('Add to Cart Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error adding to cart',
      error: error.message,
    });
  }
};

const getUserCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
      return res.status(200).json({
        success: true,
        message: 'Cart is empty',
        cart: { items: [] },
      });
    }

    const populatedItems = await Promise.all(
      cart.items.map(async item => {
        try {
          const Model = MODEL_MAP[item.productModel];
          const product = await Model.findById(item.productId);
          return product
            ? {
                product,
                quantity: item.quantity,
                productModel: item.productModel,
              }
            : null;
        } catch (err) {
          console.error('Error populating product:', err);
          return null;
        }
      })
    );

    const filteredItems = populatedItems.filter(item => item !== null);

    return res.status(200).json({
      success: true,
      message: 'Cart fetched successfully',
      cart: {
        user: cart.user,
        items: filteredItems,
      },
    });
  } catch (error) {
    console.error('Get Cart Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error fetching cart',
      error: error.message,
    });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, productModel } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: 'Cart not found for user',
      });
    }

    cart.items = cart.items.filter(
      item =>
        !(
          item.productId.toString() === productId &&
          item.productModel === productModel
        )
    );

    await cart.save();

    return res.status(200).json({
      success: true,
      message: 'Product removed from cart',
      cart,
    });
  } catch (error) {
    console.error('Remove From Cart Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error removing item from cart',
      error: error.message,
    });
  }
};

const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;
    await Cart.findOneAndUpdate(
      { user: userId },
      { $set: { items: [] } },
      { new: true }
    );
    res.json({ message: 'Cart cleared' });
  } catch (err) {
    res
      .status(500)
      .json({ message: 'Failed to clear cart', error: err.message });
  }
};

module.exports = {
  addToCart,
  getUserCart,
  removeFromCart,
  clearCart,
};
