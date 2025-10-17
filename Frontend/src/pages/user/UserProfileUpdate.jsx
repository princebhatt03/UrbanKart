import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Footer from '../../components/Footer';
import UserHeader from '../../components/UserHeader';
import defaultAvatar from '../../assets/images/prof.jpg';

const UserProfileUpdate = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [previewImage, setPreviewImage] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isGoogleUser, setIsGoogleUser] = useState(false);

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  useEffect(() => {
    const userData = localStorage.getItem('userInfo');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);

      const googleUser = parsedUser.password?.includes('_GoogleAuth');
      setIsGoogleUser(googleUser);

      setFormData({
        fullName: parsedUser.fullName || parsedUser.name || '',
        username: parsedUser.username || '',
        email: parsedUser.email || '',
        mobile: parsedUser.mobile || '',
        password: parsedUser.password || '',
        newPassword: '',
        confirmNewPassword: '',
        profileImage: parsedUser.profileImage || parsedUser.image || '',
      });

      let imageURL = defaultAvatar;
      if (parsedUser.profileImage?.startsWith('/uploads/')) {
        imageURL = `${backendURL}${parsedUser.profileImage}`;
      } else if (parsedUser.profileImage || parsedUser.image) {
        imageURL = parsedUser.profileImage || parsedUser.image;
      }

      setPreviewImage(imageURL);
    } else {
      navigate('/userLogin');
    }
  }, [navigate]);

  const handleChange = e => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
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
      formData.newPassword &&
      formData.newPassword !== formData.confirmNewPassword
    ) {
      toast.error('New passwords do not match!');
      return;
    }

    if (isGoogleUser) {
      handleUpdate(true);
    } else {
      setShowPasswordModal(true);
    }
  };

  const handleUpdate = async (skipPassword = false) => {
    if (!user) {
      toast.error('User data not loaded.');
      return;
    }

    const payload = new FormData();

    if (!skipPassword) {
      if (!currentPassword) {
        toast.error('Please enter your current password to confirm.');
        return;
      }
      payload.append('currentPassword', currentPassword);
    } else {
      payload.append('currentPassword', 'dummy_GoogleAuth');
    }

    if (formData.fullName !== (user.fullName || user.name)) {
      payload.append('fullName', formData.fullName);
    }
    if (formData.username !== user.username) {
      payload.append('username', formData.username);
    }
    if (formData.email !== user.email) {
      payload.append('email', formData.email);
    }
    if (formData.mobile !== user.mobile) {
      payload.append('mobile', formData.mobile);
    }
    if (formData.newPassword) {
      payload.append('password', formData.newPassword);
    }
    if (profileImageFile) {
      payload.append('profileImage', profileImageFile);
    }

    try {
      const response = await fetch(`${backendURL}/api/user/updateUserProfile`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`,
        },
        body: payload,
      });

      const data = await response.json();

      if (response.ok && data.user) {
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        if (data.token) {
          localStorage.setItem('userToken', data.token);
        }

        const updatedImageURL = data.user.profileImage?.startsWith('/uploads/')
          ? `${backendURL}${data.user.profileImage}`
          : data.user.image || defaultAvatar;

        setUser(data.user);
        setFormData(prev => ({
          ...prev,
          profileImage: data.user.profileImage || data.user.image,
          newPassword: '',
          confirmNewPassword: '',
        }));
        setPreviewImage(updatedImageURL);
        toast.success('Profile updated successfully!');
        setShowPasswordModal(false);
        setCurrentPassword('');
      } else {
        toast.error(data.message || 'Failed to update profile.');
      }
    } catch (error) {
      console.error('Update Error:', error);
      toast.error('Server error! Please try again later.');
    }
  };

  if (!formData) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-gray-500 text-lg">Loading user data...</p>
      </div>
    );
  }

  return (
    <>
      <UserHeader />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-100 via-white to-blue-100 p-4 sm:p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 w-full max-w-lg">
          <h2 className="text-2xl font-bold text-center mb-6 text-indigo-700">
            Update Your Profile
          </h2>

          <form
            onSubmit={openPasswordModal}
            className="space-y-5">
            <div className="text-center">
              <img
                src={previewImage}
                alt="Profile"
                className="w-24 h-24 rounded-full mx-auto mb-2 object-cover border-2 border-indigo-400"
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>

            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="tel"
              name="mobile"
              placeholder="Mobile Number"
              value={formData.mobile}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="password"
              name="newPassword"
              placeholder="New Password (optional)"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            <input
              type="password"
              name="confirmNewPassword"
              placeholder="Confirm New Password"
              value={formData.confirmNewPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />

            {isGoogleUser && (
              <p className="text-sm text-indigo-500 text-center -mt-3">
                You logged in with Google. Please Create a Password
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-between items-center mt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl border border-indigo-600 text-indigo-600 font-semibold hover:bg-indigo-100 transition">
                Go Back to Home
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition">
                Update Profile
              </button>

              <button
                type="button"
                onClick={() => navigate('/userDelete')}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition">
                Delete Account
              </button>
            </div>
          </form>

          {!isGoogleUser && showPasswordModal && (
            <div className="fixed inset-0 bg-transparent backdrop-blur flex items-center justify-center z-50">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-white rounded-xl p-6 max-w-sm w-full shadow-lg">
                <h3 className="text-xl font-bold mb-4 text-center text-indigo-700">
                  Confirm Your Current Password
                </h3>
                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={e => setCurrentPassword(e.target.value)}
                  className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-400"
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
                    onClick={() => handleUpdate(false)}
                    className="w-full sm:w-auto px-5 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition">
                    Confirm & Update
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfileUpdate;
