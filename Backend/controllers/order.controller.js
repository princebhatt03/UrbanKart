const Order = require('../models/order.model');
const Cart = require('../models/cart.model');

// Create order
exports.placeOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { items, note, total } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const order = new Order({ user: userId, items, note, total });
    await order.save();

    await Cart.deleteOne({ user: userId });

    res.status(201).json({ message: 'Order placed successfully', order });
  } catch (err) {
    console.error('Error placing order:', err);
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Get orders for logged in user
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Failed to fetch orders' });
  }
};

// Cancle Order
exports.cancelOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    const { orderId } = req.params;

    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) {
      return res
        .status(404)
        .json({ message: 'Order not found or not authorized' });
    }

    await Order.deleteOne({ _id: orderId });

    res.status(200).json({ message: 'Order cancelled successfully' });
  } catch (err) {
    console.error('Error cancelling order:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
