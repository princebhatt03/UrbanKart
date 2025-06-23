import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import defaultImage from '../../assets/images/prof.webp';

const AdminDelete = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState('');
  const [admin, setAdmin] = useState(null);
  const [token, setToken] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [isGoogleAdmin, setIsGoogleAdmin] = useState(false);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const loadAdmin = () => {
      const storedAdmin = localStorage.getItem('adminInfo');
      const storedToken = localStorage.getItem('adminToken');

      if (storedAdmin && storedToken) {
        try {
          const parsedAdmin = JSON.parse(storedAdmin);
          if (!parsedAdmin._id && parsedAdmin.id) {
            parsedAdmin._id = parsedAdmin.id;
          }

          if (!parsedAdmin._id) {
            toast.error('Invalid admin data. Please log in again.');
            navigate('/adminLogin');
            return;
          }

          setAdmin(parsedAdmin);
          setToken(storedToken);

          const isGoogle = parsedAdmin.password?.endsWith('_GoogleAuth');
          setIsGoogleAdmin(isGoogle);

          const imageURL = parsedAdmin.profileImage?.startsWith('/uploads/')
            ? `${backendURL}${parsedAdmin.profileImage}`
            : parsedAdmin.profileImage || defaultImage;

          setPreviewImage(imageURL);
        } catch (err) {
          console.error('Error parsing admin data:', err);
          navigate('/adminLogin');
        }
      } else {
        navigate('/adminLogin');
      }
    };

    loadAdmin();
    window.addEventListener('storage', loadAdmin);
    return () => window.removeEventListener('storage', loadAdmin);
  }, [navigate]);

  const handleDelete = async () => {
    if (!admin?._id) {
      toast.error('Admin ID is missing.');
      return;
    }

    try {
      const deleteUrl = `${backendURL}/api/admin/delete/${admin._id}`;
      const options = {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (!isGoogleAdmin) {
        options.headers['Content-Type'] = 'application/json';
        options.body = JSON.stringify({ password });
      }

      const response = await fetch(deleteUrl, options);
      const data = await response.json();

      if (response.ok) {
        localStorage.removeItem('adminInfo');
        localStorage.removeItem('adminToken');
        toast.success('Admin account deleted successfully!');
        setShowModal(false);
        setPassword('');
        setTimeout(() => navigate('/adminRegister'), 2000);
      } else {
        toast.error(data.message || 'Failed to delete admin.');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      toast.error('Server error. Please try again later.');
    }
  };

  if (!admin || !token) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-100 flex items-center justify-center px-4">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-red-600">
          Delete Admin Account
        </h2>

        <img
          src={previewImage}
          alt="Admin"
          className="w-24 h-24 mx-auto rounded-full border-2 border-red-500 object-cover mb-4"
        />

        <p className="text-gray-700 mb-1">
          Username: <strong>{admin.adminUsername}</strong>
        </p>
        <p className="text-gray-700 mb-4">
          Full Name: <strong>{admin.fullName}</strong>
        </p>

        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/adminHome')}
            className="bg-gray-300 text-black px-4 py-2 rounded hover:bg-gray-400 transition">
            Cancel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition">
            Delete Admin
          </button>
        </div>

        {showModal && (
          <div className="fixed inset-0 bg-transparent backdrop-blur-sm flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-sm">
              <h3 className="text-lg font-bold mb-4 text-center text-red-600">
                Confirm Admin Deletion
              </h3>

              {!isGoogleAdmin && (
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-red-400"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoFocus
                />
              )}

              <div className="flex justify-between">
                <button
                  onClick={() => {
                    setShowModal(false);
                    setPassword('');
                  }}
                  className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400">
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDelete;
