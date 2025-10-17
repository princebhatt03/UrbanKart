const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  cancelOrder,
  getTransactionDetails,
} = require('../controllers/order.controller');
const { verifyUser } = require('../middlewares/order.middleware');

router.post('/', verifyUser, placeOrder);
router.get('/my', verifyUser, getMyOrders);
router.delete('/:orderId', verifyUser, cancelOrder);
router.get('/transactions/:orderId', verifyUser, getTransactionDetails);

module.exports = router;
