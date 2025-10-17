import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/UserHeader';
import axios from 'axios';
import { FaPlus, FaEdit, FaTrash } from 'react-icons/fa';
import AdminHeader from '../../components/AdminHeader';
import toast, { Toaster } from 'react-hot-toast';

const AdminHome = () => {
  const BACKEND_URL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [password, setPassword] = useState('');
  const [modalError, setModalError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const token = localStorage.getItem('adminToken');

        const res = await axios.get(`${BACKEND_URL}/api/products`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setProducts(res.data.products || []);
      } catch (err) {
        setError('Failed to load products');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');

      await axios.delete(`${BACKEND_URL}/api/products/${selectedProduct}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: { password },
      });

      setProducts(products.filter(p => p._id !== selectedProduct));
      toast.success('Product deleted successfully!');
      setShowModal(false);
      setPassword('');
      setModalError('');
    } catch (err) {
      console.error(err);
      setModalError('Incorrect password or deletion failed.');
      toast.error('Deletion failed. Please check password.');
    }
  };

  return (
    <>
      <AdminHeader />
      {/* ✅ Global Hot Toast Component */}
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="bg-gray-100 min-h-screen px-4 py-10">
        <h1 className="text-4xl font-extrabold text-center text-orange-700 mb-2">
          Admin's Dashboard
        </h1>
        <p className="text-center text-gray-600 mb-10">
          Manage all your uploaded products here with edit and delete actions.
        </p>

        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate('/addProducts')}
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition shadow-md">
            <FaPlus /> Add Product
          </button>
        </div>

        {loading ? (
          <p className="text-center text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-center text-red-600">{error}</p>
        ) : products.length === 0 ? (
          <div className="text-center text-gray-600">
            <p>No products found.</p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map(product => (
              <div
                key={product._id}
                className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 p-4 flex flex-col">
                <img
                  src={`${BACKEND_URL}${
                    product.image.startsWith('/uploads/')
                      ? product.image
                      : `/uploads/${product.image}`
                  }`}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded mb-3"
                />

                <h3 className="text-lg font-bold text-gray-800">
                  {product.name}
                </h3>
                <span className="text-xs text-white bg-orange-500 inline-block px-3 py-1 rounded-full mt-1 w-fit">
                  {product.category || 'Uncategorized'}
                </span>
                <p className="text-gray-700 font-semibold mt-2">
                  ₹{product.price}
                </p>
                <div className="flex justify-between mt-auto pt-4">
                  <button
                    onClick={() => navigate(`/admin/edit/${product._id}`)}
                    className="flex items-center gap-1 text-sm bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 transition">
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedProduct(product._id);
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-transparent backdrop-blur-md flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Confirm Deletion
            </h2>
            <p className="text-gray-600 mb-3">
              Enter your password to confirm deletion:
            </p>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3 focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Admin Password"
            />
            {modalError && (
              <p className="text-red-600 text-sm mb-2">{modalError}</p>
            )}
            <div className="flex justify-end gap-3 mt-4">
              <button
                onClick={() => {
                  setShowModal(false);
                  setPassword('');
                  setModalError('');
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400">
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHome;
