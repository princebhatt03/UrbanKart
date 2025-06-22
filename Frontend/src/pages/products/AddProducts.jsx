import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ImagePlus,
  Loader2,
  IndianRupee,
  Tag,
  Type,
  StickyNote,
  Upload,
} from 'lucide-react';
import { io } from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddProduct = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: '',
    description: '',
  });

  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const newSocket = io(backendURL);
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, [backendURL]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    setImageFile(e.target.files[0]);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem('adminToken');
      const payload = new FormData();

      payload.append('name', formData.name);
      payload.append('price', formData.price);
      payload.append('description', formData.description);
      payload.append('category', formData.category);
      payload.append('image', imageFile);

      const res = await axios.post(`${backendURL}/api/products/add`, payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success(res.data.message || 'Product added successfully!');

      if (socket) {
        socket.emit('newProductUploaded', res.data.product);
      }

      setFormData({ name: '', price: '', category: '', description: '' });
      setImageFile(null);

      setTimeout(() => navigate('/adminHome'), 2000);
    } catch (err) {
      const errorMsg = err.response?.data?.message || 'Something went wrong';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-2xl mx-auto mt-10 p-6 bg-white shadow-2xl rounded-2xl">
      <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-6 flex items-center justify-center gap-2">
        <Upload
          className="text-orange-500"
          size={28}
        />{' '}
        Add New Product
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-5"
        encType="multipart/form-data">
        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold flex items-center gap-1">
            <Tag size={18} /> Product Name
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="Enter product name"
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold flex items-center gap-1">
            <IndianRupee size={18} /> Price (₹)
          </label>
          <input
            type="text"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            placeholder="Enter price"
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold flex items-center gap-1">
            <Type size={18} /> Category
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            placeholder="Enter product category"
            className="px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold flex items-center gap-1">
            <StickyNote size={18} /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="3"
            placeholder="Enter product description"
            className="px-4 py-2 border rounded-md shadow-sm resize-none focus:outline-none focus:ring-2 focus:ring-orange-400"></textarea>
        </div>

        <div className="flex flex-col">
          <label className="text-gray-700 font-semibold flex items-center gap-1">
            <ImagePlus size={18} /> Product Image
          </label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="px-4 py-2 border rounded-md file:mr-4 file:py-2 file:px-4 file:border-0 file:rounded-md file:bg-orange-600 file:text-white hover:file:bg-orange-700"
          />
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileTap={{ scale: 0.96 }}
          className="w-full bg-orange-600 hover:bg-orange-700 transition duration-200 text-white font-semibold py-2 rounded-lg shadow-md flex justify-center items-center gap-2">
          {loading ? (
            <Loader2
              className="animate-spin"
              size={20}
            />
          ) : (
            <Upload size={20} />
          )}
          {loading ? 'Adding Product...' : 'Add Product'}
        </motion.button>

        <motion.button
          type="button"
          onClick={() => navigate('/adminHome')}
          disabled={loading}
          whileTap={{ scale: 0.96 }}
          className="w-full bg-red-600 hover:bg-red-700 transition duration-200 text-white font-semibold py-2 rounded-lg shadow-md flex justify-center items-center gap-2">
          Cancel
        </motion.button>
      </form>
    </motion.div>
  );
};

export default AddProduct;
