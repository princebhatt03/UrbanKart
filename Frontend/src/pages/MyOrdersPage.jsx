import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import UserHeader from '../components/UserHeader';
import Footer from '../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const [cancelModal, setCancelModal] = useState({
    visible: false,
    orderId: null,
  });
  const [transactionModal, setTransactionModal] = useState({
    visible: false,
    data: null,
  });

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(`${BACKEND_URL}/api/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });
      setOrders(res.data);
    } catch (err) {
      console.error('Failed to load orders', err);
      toast.error('Failed to load orders');
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const confirmCancelOrder = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${BACKEND_URL}/api/orders/${cancelModal.orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      setCancelModal({ visible: false, orderId: null });
      toast.success('Order cancelled successfully. Refund will be processed.');
      fetchOrders();
    } catch (err) {
      console.error('Failed to cancel order', err);
      toast.error('Failed to cancel order');
    }
  };

  const fetchTransactionDetails = async orderId => {
    try {
      const token = localStorage.getItem('userToken');
      const res = await axios.get(
        `${BACKEND_URL}/api/orders/transactions/${orderId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      setTransactionModal({ visible: true, data: res.data });
    } catch (err) {
      console.error('Failed to fetch transaction', err);
      toast.error('Transaction not found for this order');
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <UserHeader />
      <main className="min-h-screen px-4 sm:px-8 py-8 bg-[#f9fafb]">
        <h2 className="text-2xl font-bold mb-6 text-center">My Orders</h2>

        {orders.length === 0 ? (
          <p className="text-center text-gray-600">No orders found.</p>
        ) : (
          <div className="space-y-6">
            {orders.map((order, idx) => (
              <div
                key={order._id}
                className="bg-white p-4 rounded shadow space-y-2">
                <div className="flex justify-between items-center">
                  <div className="font-semibold text-lg">Order #{idx + 1}</div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => fetchTransactionDetails(order._id)}
                      className="text-sm px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition">
                      View Transaction
                    </button>
                    <button
                      onClick={() =>
                        setCancelModal({ visible: true, orderId: order._id })
                      }
                      className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                      Cancel Order
                    </button>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  Placed on: {new Date(order.createdAt).toLocaleString()}
                </div>

                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="border-b py-2">
                    <div className="flex justify-between">
                      <p>{item.product.name}</p>
                      <p>
                        ₹{item.product.price.toFixed(2)} × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}

                <div className="text-right font-bold mt-2">
                  Total: ₹{order.total.toFixed(2)}
                </div>

                {order.note && (
                  <div className="text-sm italic text-yellow-700">
                    Note: {order.note}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Cancel Modal */}
        {cancelModal.visible && (
          <div className="fixed inset-0 z-50 bg-transparent bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-sm w-full p-6 relative">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                Are you sure you want to cancel this order?
              </h3>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() =>
                    setCancelModal({ visible: false, orderId: null })
                  }
                  className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 transition">
                  No
                </button>
                <button
                  onClick={confirmCancelOrder}
                  className="px-4 py-2 rounded bg-red-500 text-white hover:bg-red-600 transition">
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Transaction Modal */}
        {transactionModal.visible && transactionModal.data && (
          <div className="fixed inset-0 z-50 bg-transparent bg-opacity-30 backdrop-blur-sm flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 space-y-4 relative">
              <h3 className="text-lg font-bold text-gray-800 border-b pb-2">
                Transaction Details
              </h3>

              <div className="text-sm text-gray-700 space-y-1">
                <p>
                  <strong>Payment ID:</strong>{' '}
                  {transactionModal.data.payment_id}
                </p>
                <p>
                  <strong>Order ID:</strong> {transactionModal.data.order_id}
                </p>
                <p>
                  <strong>Status:</strong> {transactionModal.data.status}
                </p>
                <p>
                  <strong>Method:</strong> {transactionModal.data.method}
                </p>
                <p>
                  <strong>Amount:</strong> ₹
                  {(transactionModal.data.amount / 100).toFixed(2)}
                </p>
                <p>
                  <strong>Date:</strong>{' '}
                  {new Date(transactionModal.data.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  onClick={() =>
                    setTransactionModal({ visible: false, data: null })
                  }
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
};

export default MyOrders;
