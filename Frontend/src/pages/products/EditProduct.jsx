import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast'; 

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    image: '',
  });
  const [preview, setPreview] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        const backendURL =
          import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

        const res = await axios.get(`${backendURL}/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setFormData(res.data);
        const imagePath = res.data.image.startsWith('/uploads/')
          ? res.data.image
          : `/uploads/${res.data.image}`;
        setPreview(`${backendURL}${imagePath}`);
      } catch (err) {
        toast.error('Failed to fetch product.');
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = e => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      setPreview(URL.createObjectURL(file));
    }
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

      if (formData.image instanceof File) {
        payload.append('image', formData.image);
      }

      const backendURL =
        import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

      const res = await axios.put(`${backendURL}/api/products/${id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success(res.data.message || 'Product updated successfully!');
      setTimeout(() => navigate('/adminHome'), 2000);
    } catch (err) {
      toast.error('Update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />{' '}
      {/* ✅ added */}
      <h2 className="text-2xl font-bold text-center mb-4">Edit Product</h2>
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="space-y-4">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Product Name"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <input
          type="text"
          name="price"
          value={formData.price}
          onChange={handleChange}
          placeholder="Price"
          className="w-full px-4 py-2 border rounded"
          required
        />
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Description"
          className="w-full px-4 py-2 border rounded"
          rows="3"
          required
        />
        <input
          type="text"
          name="category"
          value={formData.category}
          onChange={handleChange}
          placeholder="Category"
          className="w-full px-4 py-2 border rounded"
        />
        <input
          type="file"
          name="image"
          onChange={handleFileChange}
          accept="image/*"
          className="w-full px-4 py-2 border rounded"
        />
        {preview && (
          <img
            src={preview}
            alt="Preview"
            className="w-full h-40 object-cover rounded"
          />
        )}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {loading ? 'Updating...' : 'Update Product'}
        </button>
      </form>
    </div>
  );
};

export default EditProduct;
