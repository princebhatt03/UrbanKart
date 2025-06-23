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

      // Add a slight delay to ensure toast isn't interrupted by re-renders
      setTimeout(() => {
        toast.success(
          'Order cancelled successfully. Your payment will be refunded to your account within 24 hours.'
        );
      }, 100);

      fetchOrders();
    } catch (err) {
      console.error('Failed to cancel order', err);
      toast.error('Failed to cancel order');
    }
  };

  return (
    <>
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
                  <button
                    onClick={() =>
                      setCancelModal({ visible: true, orderId: order._id })
                    }
                    className="text-sm px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 transition">
                    Cancel Order
                  </button>
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

        {/* Cancel Confirmation Modal */}
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
      </main>
      <Footer />
    </>
  );
};

export default MyOrders;
