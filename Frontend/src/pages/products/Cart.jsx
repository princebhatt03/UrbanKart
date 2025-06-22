import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import UserHeader from '../../components/UserHeader';
import Footer from '../../components/Footer';
import { motion } from 'framer-motion';
import { FaTrashAlt } from 'react-icons/fa';
import { FiMinus, FiPlus } from 'react-icons/fi';
import { MdShoppingCart } from 'react-icons/md';
import { toast } from 'react-toastify';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function CartPage() {
  const navigate = useNavigate();
  const [note, setNote] = useState('');
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('Please login to view your cart');
        navigate('/userLogin');
        return;
      }
      try {
        const { data } = await axios.get(`${BACKEND_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setCartItems(data.cart?.items || []);
      } catch (err) {
        console.error('Cart fetch error:', err);
        alert(err.response?.data?.message || 'Error loading cart.');
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [navigate]);

  const updateQuantity = (prodId, type) => {
    setCartItems(prev =>
      prev.map(i =>
        i.product?._id === prodId
          ? {
              ...i,
              quantity:
                type === 'inc' ? i.quantity + 1 : Math.max(1, i.quantity - 1),
            }
          : i
      )
    );
  };

  const removeItem = async (prodId, productModel) => {
    const token = localStorage.getItem('userToken');
    try {
      await axios.delete(
        `${BACKEND_URL}/api/cart/remove/${prodId}/${productModel}`,
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setCartItems(prev =>
        prev.filter(
          i => !(i.product?._id === prodId && i.productModel === productModel)
        )
      );
    } catch (err) {
      console.error('Remove error:', err);
      alert(err.response?.data?.message || 'Could not remove item.');
    }
  };

  const subtotal = cartItems.reduce((acc, i) => {
    if (i.product && i.product.price) {
      return acc + i.product.price * i.quantity;
    }
    return acc;
  }, 0);

  return (
    <>
      <UserHeader />
      <main className="bg-[#f9fafb] min-h-screen text-[#141414] font-sans px-4 py-8 sm:px-8">
        <motion.h2
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center text-3xl font-bold mb-8 flex justify-center items-center gap-2">
          <MdShoppingCart className="text-[#FF708E]" /> Your Cart
        </motion.h2>

        {loading ? (
          <p className="text-center text-gray-500">Loading cart...</p>
        ) : cartItems.length === 0 ? (
          <motion.div
            className="text-center space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}>
            <h3 className="text-xl font-semibold">No products in your cart</h3>
            <p className="text-gray-600">Start shopping now!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-[#FF708E] text-white px-6 py-2 rounded hover:bg-[#e85e7b] transition">
              Go to Home
            </button>
          </motion.div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {/* Items */}
            <div className="md:col-span-2 space-y-6">
              <div className="hidden sm:grid grid-cols-5 font-bold border-b pb-2 mb-2">
                <div className="col-span-2">Product</div>
                <div>Price</div>
                <div>Qty</div>
                <div>Total</div>
              </div>

              {cartItems.map(item =>
                item.product ? (
                  <motion.div
                    key={item.product._id + item.productModel}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="grid sm:grid-cols-5 gap-4 items-center border-b pb-4">
                    <div className="sm:col-span-2 flex items-center gap-4">
                      <img
                        src={BACKEND_URL + item.product.image}
                        alt={item.product.name}
                        className="w-20 h-24 object-cover rounded shadow"
                        onError={e =>
                          (e.target.src = 'https://via.placeholder.com/100')
                        }
                      />
                      <div>
                        <p className="font-medium">{item.product.name}</p>
                        {item.product.color && (
                          <p className="text-sm text-gray-500">
                            Color: {item.product.color}
                          </p>
                        )}
                        {item.product.size && (
                          <p className="text-sm text-gray-500">
                            Size: {item.product.size}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          Source: {item.productModel}
                        </p>
                      </div>
                    </div>
                    <div>₹{item.product.price.toFixed(2)}</div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product._id, 'dec')}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                        <FiMinus />
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, 'inc')}
                        className="p-1 bg-gray-200 rounded hover:bg-gray-300">
                        <FiPlus />
                      </button>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                      <button
                        onClick={() =>
                          removeItem(item.product._id, item.productModel)
                        }
                        className="text-[#FF708E] hover:text-red-600 text-lg">
                        <FaTrashAlt />
                      </button>
                    </div>
                  </motion.div>
                ) : null
              )}
            </div>

            {/* Summary */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6">
              <div>
                <h3 className="font-medium mb-2">Add a note</h3>
                <textarea
                  rows="4"
                  className="w-full border p-2 rounded resize-none"
                  placeholder="Write your note..."
                  value={note}
                  onChange={e => setNote(e.target.value)}
                />
              </div>
              <div className="bg-white shadow rounded p-4 space-y-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Shipping & taxes calculated at checkout
                </p>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    className="accent-[#FF708E]"
                    checked={agreeToTerms}
                    onChange={e => setAgreeToTerms(e.target.checked)}
                  />
                  I agree with the terms and conditions
                </label>
                <button
                  type="submit"
                  className="w-full py-2 bg-[#141414] text-white font-semibold rounded hover:bg-[#FF708E] transition-all"
                  onClick={() => {
                    if (!agreeToTerms) {
                      toast.error('Please agree to the terms and conditions.');
                      return;
                    }
                    if (cartItems.length === 0) {
                      toast.error('Cart is empty');
                      return;
                    }
                    navigate('/checkout', { state: { cartItems, note } });
                  }}>
                  Checkout
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
