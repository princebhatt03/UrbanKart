const express = require('express');
const router = express.Router();
const {
  placeOrder,
  getMyOrders,
  cancelOrder,
} = require('../controllers/order.controller');
const { verifyUser } = require('../middlewares/order.middleware');

router.post('/', verifyUser, placeOrder);
router.get('/my', verifyUser, getMyOrders);
router.delete('/:orderId', verifyUser, cancelOrder);

module.exports = router;
