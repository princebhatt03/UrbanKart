const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    tag: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shop', shopSchema);
