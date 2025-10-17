import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import UserHeader from '../../components/UserHeader';
import Footer from '../../components/Footer';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

function loadScript(src) {
  return new Promise(resolve => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const { state } = useLocation();
  const cartItems = state?.cartItems || [];
  const note = state?.note || '';

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const handlePayment = async e => {
    e.preventDefault();
    setIsProcessing(true);

    const loaded = await loadScript(
      'https://checkout.razorpay.com/v1/checkout.js'
    );
    if (!loaded) {
      toast.error('Failed to load Razorpay SDK.');
      setIsProcessing(false);
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        toast.error('Please login to proceed.');
        setIsProcessing(false);
        return;
      }

      // ✅ 1. Create Local Order in MongoDB
      const { data: localOrderRes } = await axios.post(
        `${BACKEND_URL}/api/orders`,
        {
          items: cartItems,
          total: subtotal,
          note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const mongoOrderId = localOrderRes.order._id;

      // ✅ 2. Create Razorpay Order (linked to local orderId)
      const { data: razorpayOrder } = await axios.post(
        `${BACKEND_URL}/api/payment`,
        {
          amount: subtotal * 100,
          orderId: mongoOrderId, // 👈 Important for linking Transaction
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // ✅ 3. Configure Razorpay Options
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: razorpayOrder.amount.toString(),
        currency: razorpayOrder.currency,
        name: 'UrbanKart',
        description: 'Order Payment',
        order_id: razorpayOrder.id,
        handler: async function (response) {
          try {
            // ✅ 4. Verify Razorpay Payment
            await axios.post(
              `${BACKEND_URL}/api/payment/verify`,
              {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                orderId: mongoOrderId, // 👈 Send for linking in Transaction model
              },
              {
                headers: { Authorization: `Bearer ${token}` },
              }
            );

            // ✅ 5. Clear Cart after successful payment
            await axios.delete(`${BACKEND_URL}/api/cart/clear`, {
              headers: { Authorization: `Bearer ${token}` },
            });

            toast.success('Payment successful!');
            navigate('/');
          } catch (err) {
            toast.error('Payment verification failed.');
            console.error(err);
          }
        },
        prefill: {
          name: state?.userName || 'UrbanKart User',
          email: state?.userEmail || 'user@example.com',
        },
        theme: { color: '#FF708E' },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error(error);
      toast.error('Error initiating payment.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" />
      <UserHeader />
      <main className="px-4 py-8 bg-gray-100 min-h-screen">
        <h2 className="text-2xl font-bold text-center mb-6">Checkout</h2>

        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600">No items to checkout.</p>
        ) : (
          <div className="md:flex gap-8">
            <div className="md:w-1/2 space-y-4">
              <h3 className="text-xl font-semibold">Your Items</h3>
              {cartItems.map(item => (
                <div
                  key={item.product._id}
                  className="flex gap-4 items-center border-b pb-4">
                  <img
                    src={`${BACKEND_URL}${item.product.image}`}
                    alt={item.product.name}
                    className="w-16 h-20 object-cover rounded"
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
                <div className="mt-4 p-4 bg-yellow-100 border-yellow-300 rounded">
                  <h4 className="font-semibold">Delivery Note:</h4>
                  <p className="text-sm text-gray-800">{note}</p>
                </div>
              )}
            </div>

            <form
              onSubmit={handlePayment}
              className="md:w-1/2 bg-white p-6 shadow rounded space-y-4">
              <h3 className="text-xl font-semibold">Payment</h3>
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-2 bg-pink-500 text-white font-semibold rounded disabled:opacity-50">
                {isProcessing ? 'Processing...' : `Pay ₹${subtotal.toFixed(2)}`}
              </button>
            </form>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
