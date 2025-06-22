import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { ShoppingCart, Star, Eye, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

export default function Shop() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/api/products/shop`);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Error fetching products:', err);
        toast.error('Failed to fetch products');
      }
    };
    fetchProducts();
  }, []);

  const addToCart = async productId => {
    const token = localStorage.getItem('userToken');
    if (!token) {
      toast.error('Please login to add to cart');
      return navigate('/userLogin');
    }

    try {
      const res = await axios.post(
        `${BACKEND_URL}/api/cart/add`,
        { productId, productModel: 'Shop' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success(res.data.message || 'Added to cart!');
    } catch (err) {
      console.error('Add to cart error:', err);
      toast.error(err.response?.data?.message || 'Could not add to cart.');
    }
  };

  return (
    <>
      <section className="bg-white min-h-screen p-6">
        <h2 className="text-3xl font-bold text-center mb-10">
          Shop All Categories
        </h2>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {products.map(product => (
            <motion.div
              key={product._id}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-lg shadow hover:shadow-xl transition p-3 border">
              <div className="relative overflow-hidden rounded-lg">
                <img
                  src={`${BACKEND_URL}${product.image}`}
                  alt={product.name}
                  className="w-full h-72 object-cover rounded-lg"
                  onError={e =>
                    (e.target.src = 'https://via.placeholder.com/300')
                  }
                />

                {product?.tag && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded">
                    {product.tag.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="mt-3">
                <h4 className="text-lg font-semibold">{product.name}</h4>
                <p className="text-gray-600 text-sm capitalize">
                  {product.category}
                </p>
                <div className="flex items-center gap-1 text-yellow-500 mt-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={14}
                      fill={i < 4 ? '#FBBF24' : 'none'}
                    />
                  ))}
                </div>
                <div className="mt-2 text-base text-[#111] font-semibold">
                  ₹{product.price.toFixed(2)}
                </div>

                <div className="flex items-center justify-between mt-4">
                  <button
                    onClick={() => addToCart(product._id)}
                    className="bg-[#FF708E] hover:bg-[#e55d78] text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 transition">
                    <ShoppingCart size={16} /> Add to Cart
                  </button>

                  <div className="flex items-center gap-2 text-gray-500">
                    <Eye
                      className="hover:text-black cursor-pointer"
                      size={18}
                    />
                    <Heart
                      className="hover:text-red-600 cursor-pointer"
                      size={18}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ✅ Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        pauseOnHover={false}
      />
    </>
  );
}
