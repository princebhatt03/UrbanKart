import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import image1 from '../../assets/images/prof.jpg';

const AdminProfileUpdate = () => {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isGoogleAdmin, setIsGoogleAdmin] = useState(false);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const adminData = localStorage.getItem('adminInfo');
    if (adminData) {
      const parsedAdmin = JSON.parse(adminData);
      const googleAdminAuth = parsedAdmin?.password?.endsWith('_GoogleAuth');
      setIsGoogleAdmin(googleAdminAuth);
      setAdmin(parsedAdmin);

      setFormData({
        fullName: parsedAdmin.fullName || '',
        adminUsername: parsedAdmin.adminUsername || '',
        email: parsedAdmin.email || '',
        mobile: parsedAdmin.mobile || '',
        newPassword: '',
        confirmNewPassword: '',
      });

      let imageURL = image1;
      if (parsedAdmin.profileImage) {
        if (parsedAdmin.profileImage.startsWith('/uploads/')) {
          imageURL = `${backendURL}${parsedAdmin.profileImage}`;
        } else if (parsedAdmin.profileImage.startsWith('http')) {
          imageURL = parsedAdmin.profileImage;
        }
      }
      setPreviewImage(imageURL);
    } else {
      navigate('/adminLogin');
    }
  }, [navigate]);

  const handleChange = e => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      setProfileImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const openPasswordModal = e => {
    e.preventDefault();

    if (
      !isGoogleAdmin &&
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      toast.error('New passwords do not match!');
      return;
    }

    if (isGoogleAdmin) {
      handleUpdate();
    } else {
      setShowPasswordModal(true);
    }
  };

  const handleUpdate = async () => {
    if (!admin) {
      toast.error('⚠️ Admin data not loaded.');
      return;
    }

    if (!isGoogleAdmin && !currentPassword) {
      toast.error('Please enter your current password to confirm.');
      return;
    }

    const payload = new FormData();
    if (!isGoogleAdmin) payload.append('currentPassword', currentPassword);

    if (formData.fullName !== admin.fullName)
      payload.append('fullName', formData.fullName);
    if (formData.adminUsername !== admin.adminUsername)
      payload.append('adminUsername', formData.adminUsername);
    if (formData.email !== admin.email) payload.append('email', formData.email);
    if (formData.mobile !== admin.mobile)
      payload.append('mobile', formData.mobile);
    if (!isGoogleAdmin && formData.newPassword)
      payload.append('password', formData.newPassword);
    if (profileImageFile) payload.append('profileImage', profileImageFile);

    try {
      const response = await fetch(
        `${backendURL}/api/admin/updateAdminProfile`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('adminToken') || ''}`,
          },
          body: payload,
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminInfo');
        navigate('/adminLogin');
        return;
      }

      if (response.ok && data.admin) {
        if (isGoogleAdmin) {
          data.admin.password = '_GoogleAuth';
        }

        localStorage.setItem('adminInfo', JSON.stringify(data.admin));
        if (data.token) {
          localStorage.setItem('adminToken', data.token);
          window.dispatchEvent(new Event('storage'));
        }

        let updatedImageURL = image1;
        if (data.admin.profileImage) {
          if (data.admin.profileImage.startsWith('/uploads/')) {
            updatedImageURL = `${backendURL}${data.admin.profileImage}`;
          } else if (data.admin.profileImage.startsWith('http')) {
            updatedImageURL = data.admin.profileImage;
          }
        }

        setAdmin(data.admin);
        setPreviewImage(updatedImageURL);
        toast.success('Profile updated successfully!');
        setShowPasswordModal(false);
        setCurrentPassword('');
        setFormData(prev => ({
          ...prev,
          profileImage: data.admin.profileImage,
        }));
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (err) {
      console.error('Update Error:', err);
      toast.error('⚠️ Server error! Please try again later.');
    }
  };

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading admin data...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-100 via-white to-orange-100 p-4 sm:p-6">
      <Toaster
        position="top-center"
        reverseOrder={false}
      />{' '}
      {/* ✅ Add Toaster */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-orange-700">
          Update Admin Profile
        </h2>

        <form
          onSubmit={openPasswordModal}
          className="space-y-5">
          <div className="text-center">
            <img
              src={previewImage}
              alt="Admin"
              className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-2 border-orange-400"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
            />
          </div>

          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="text"
            name="adminUsername"
            placeholder="Username"
            value={formData.adminUsername}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          <input
            type="tel"
            name="mobile"
            placeholder="Mobile Number"
            value={formData.mobile}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
          />

          {!isGoogleAdmin && (
            <>
              <input
                type="password"
                name="newPassword"
                placeholder="New Password (optional)"
                value={formData.newPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
              <input
                type="password"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={formData.confirmNewPassword}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </>
          )}

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center mt-4">
            <button
              type="button"
              onClick={() => navigate('/adminHome')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl border border-orange-600 text-orange-600 font-semibold hover:bg-orange-100 transition">
              Go Back to Dashboard
            </button>

            <button
              type="submit"
              className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-orange-600 hover:bg-orange-700 transition">
              Update Profile
            </button>

            <button
              type="button"
              onClick={() => navigate('/adminDelete')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition">
              Delete Admin Account
            </button>
          </div>
        </form>

        {!isGoogleAdmin && showPasswordModal && (
          <div className="fixed inset-0 bg-transparent backdrop-blur flex items-center justify-center z-50">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
              <h3 className="text-xl font-bold mb-4 text-center text-orange-700">
                Confirm Current Password
              </h3>
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={e => setCurrentPassword(e.target.value)}
                className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-400"
                autoFocus
              />
              <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentPassword('');
                  }}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl border border-gray-400 hover:bg-gray-100 transition">
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="w-full sm:w-auto px-5 py-2 rounded-xl bg-orange-600 text-white hover:bg-orange-700 transition">
                  Confirm & Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminProfileUpdate;
