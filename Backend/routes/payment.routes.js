const express = require('express');
const Razorpay = require('razorpay');
const crypto = require('crypto');
const router = express.Router();
const Transaction = require('../models/transaction.model');
const { verifyUser } = require('../middlewares/order.middleware');

// 🔐 Razorpay Instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// ✅ 1. Create Razorpay Order (linked with Mongo Order)
router.post('/', verifyUser, async (req, res) => {
  const {
    amount,
    currency = 'INR',
    receipt = `rcpt_${Date.now()}`,
    orderId,
  } = req.body;

  if (!amount || isNaN(amount) || !orderId) {
    return res.status(400).json({ error: 'Invalid amount or missing orderId' });
  }

  try {
    const options = {
      amount: parseInt(amount), // in paise
      currency,
      receipt,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    // ✅ Store transaction reference now (will be updated after payment success)
    const transaction = new Transaction({
      orderId, // MongoDB Order ID
      order_id: order.id, // Razorpay Order ID
      status: 'Created',
      amount: amount,
      created_at: new Date(),
    });

    await transaction.save();

    res.status(200).json(order);
  } catch (err) {
    console.error('Razorpay Order Creation Error:', err);
    res.status(500).json({ error: 'Failed to create Razorpay order' });
  }
});

// ✅ 2. Verify Razorpay Payment Signature
router.post('/verify', verifyUser, async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    orderId,
  } = req.body;

  if (
    !razorpay_order_id ||
    !razorpay_payment_id ||
    !razorpay_signature ||
    !orderId
  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid signature' });
    }

    // ✅ Update existing transaction with payment info
    const updated = await Transaction.findOneAndUpdate(
      { order_id: razorpay_order_id },
      {
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        status: 'Success',
        method: 'Razorpay',
        updated_at: new Date(),
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ error: 'Transaction not found to update' });
    }

    return res.status(200).json({ message: 'Payment verified successfully' });
  } catch (error) {
    console.error('Signature Verification Error:', error);
    return res.status(500).json({ error: 'Server error during verification' });
  }
});

module.exports = router;
