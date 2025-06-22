import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import UserHeader from '../../components/UserHeader';
import Footer from '../../components/Footer';
import axios from 'axios';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];
  const note = state?.note || '';

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    card: '',
    expiry: '',
    cvv: '',
  });

  const subtotal = cartItems.reduce((acc, item) => {
    return acc + (item.product?.price || 0) * item.quantity;
  }, 0);

  const handlePayment = async e => {
    e.preventDefault();
    setIsLoading(true);

    // Show loader for 2s before showing modal
    setTimeout(() => {
      setIsLoading(false);
      setShowModal(true);

      // Auto-close modal after 3s and place order
      setTimeout(() => {
        handleModalClose();
      }, 3000);
    }, 2000);
  };

  const handleModalClose = async () => {
    setShowModal(false);

    try {
      const token = localStorage.getItem('userToken');

      // Save order to backend
      await axios.post(
        `${BACKEND_URL}/api/orders`,
        {
          items: cartItems,
          note,
          total: subtotal,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );

      // Clear cart
      await axios.delete(`${BACKEND_URL}/api/cart/clear`, {
        headers: { Authorization: `Bearer ${token}` },
        withCredentials: true,
      });

      toast.success('Order Placed Successfully!');
      navigate('/');
    } catch (err) {
      console.error('Error placing order or clearing cart:', err);
      toast.error('Something went wrong. Please try again.');
    }
  };

  return (
    <>
      <UserHeader />
      <main className="min-h-screen px-4 sm:px-8 py-8 bg-[#f9fafb] text-[#141414] relative">
        <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">No items to checkout.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-8">
            {/* Product Summary */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2">Your Items</h3>
              {cartItems.map(item => (
                <div
                  key={item.product._id + item.productModel}
                  className="flex items-center gap-4 border-b pb-4">
                  <img
                    src={BACKEND_URL + item.product.image}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover rounded shadow"
                  />
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-gray-500">
                      Qty: {item.quantity} × ₹{item.product.price.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-500">
                      Total: ₹{(item.quantity * item.product.price).toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
              <div className="text-right font-bold text-lg">
                Subtotal: ₹{subtotal.toFixed(2)}
              </div>
              {note && (
                <div className="mt-6 p-4 bg-yellow-100 border border-yellow-300 rounded">
                  <h4 className="font-semibold mb-1">Delivery Note:</h4>
                  <p className="text-sm text-gray-800">{note}</p>
                </div>
              )}
            </div>

            {/* Payment Form */}
            <form
              onSubmit={handlePayment}
              className="bg-white shadow rounded p-6 space-y-4">
              <h3 className="text-xl font-semibold mb-2">Payment Details</h3>

              <input
                type="text"
                placeholder="Full Name"
                required
                className="w-full border p-2 rounded"
                value={formData.name}
                onChange={e =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <input
                type="email"
                placeholder="Email Address"
                required
                className="w-full border p-2 rounded"
                value={formData.email}
                onChange={e =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              <input
                type="text"
                placeholder="Card Number"
                required
                className="w-full border p-2 rounded"
                value={formData.card}
                onChange={e =>
                  setFormData({ ...formData, card: e.target.value })
                }
              />
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  required
                  className="w-1/2 border p-2 rounded"
                  value={formData.expiry}
                  onChange={e =>
                    setFormData({ ...formData, expiry: e.target.value })
                  }
                />
                <input
                  type="text"
                  placeholder="CVV"
                  required
                  className="w-1/2 border p-2 rounded"
                  value={formData.cvv}
                  onChange={e =>
                    setFormData({ ...formData, cvv: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                className="w-full py-2 bg-[#FF708E] text-white font-semibold rounded hover:bg-[#e85e7b] transition-all">
                Pay ₹{subtotal.toFixed(2)}
              </button>
            </form>
          </div>
        )}

        {/* Spinner Loader */}
        {isLoading && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-40 backdrop-blur-sm">
            <div className="border-t-4 border-b-4 border-pink-500 rounded-full w-12 h-12 animate-spin"></div>
          </div>
        )}

        {/* Success Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-transparent bg-opacity-30 backdrop-blur-sm p-4">
            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative animate-fadeInUp">
              <button
                className="absolute top-3 right-3 text-gray-500 hover:text-black"
                onClick={handleModalClose}>
                ✕
              </button>
              <div className="flex flex-col items-center space-y-4">
                <div className="bg-green-100 rounded-full p-4">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  Payment Successful!
                </h3>
                <div className="w-full space-y-2 text-gray-700">
                  <p>
                    <strong>Name:</strong> {formData.name}
                  </p>
                  <p>
                    <strong>Email:</strong> {formData.email}
                  </p>
                  <p>
                    <strong>Card:</strong> **** **** ****{' '}
                    {formData.card.slice(-4)}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
