const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  items: [
    {
      product: {
        type: Object, 
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      productModel: {
        type: String,
        enum: ['Product', 'Shop'],
        required: true,
      },
    },
  ],
  total: {
    type: Number,
    required: true,
  },
  note: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
