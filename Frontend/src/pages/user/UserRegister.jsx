import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import img1 from '../../assets/images/register.jpg';
import Header from '../../components/UserHeader';
import Footer from '../../components/Footer';
import { useGoogleLogin } from '@react-oauth/google';
import { googleAuth } from '../../api';
import toast, { Toaster } from 'react-hot-toast';

const UserRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    mobile: '',
    password: '',
  });

  const [profileImage, setProfileImage] = useState(null);

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    setProfileImage(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    const finalURL =
      import.meta.env.VITE_BACKEND_URL ||
      import.meta.env.VITE_LOCAL_BACKEND_URL;

    if (!finalURL) {
      toast.error('Backend URL is not configured in .env file');
      setLoading(false);
      return;
    }

    const { fullName, username, email, mobile, password } = formData;

    if (
      !fullName.trim() ||
      !username.trim() ||
      !email.trim() ||
      !mobile.trim() ||
      !password.trim()
    ) {
      toast.error('Please fill all fields');
      setLoading(false);
      return;
    }

    const data = new FormData();
    data.append('fullName', fullName.trim());
    data.append('username', username.trim());
    data.append('email', email.trim());
    data.append('mobile', mobile.trim());
    data.append('password', password.trim());
    if (profileImage) data.append('profileImage', profileImage);

    try {
      const response = await fetch(`${finalURL}/api/user/register`, {
        method: 'POST',
        body: data,
      });

      const result = await response.json();

      if (response.ok) {
        toast.success('User registered successfully, Now Login to Continue');
        setTimeout(() => navigate('/userLogin'), 2000);
      } else {
        toast.error(result.message || 'Registration failed.');
      }
    } catch (error) {
      console.error('Registration Error:', error);
      toast.error('⚠️ Server error! Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const responseGoogle = async authResult => {
    try {
      if (authResult['code']) {
        const result = await googleAuth(authResult['code']);
        const { token, user } = result.data;

        const finalUser = {
          ...user,
          password: '_GoogleAuth',
          profileImage: user.profileImage || user.image || '',
        };

        localStorage.setItem('userToken', token);
        localStorage.setItem('userInfo', JSON.stringify(finalUser));

        toast.success('Google registration successful!');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.log('Error while handling Google Auth: ', error);
      toast.error('⚠️ Google login failed. Try again.');
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: 'auth-code',
  });

  return (
    <>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-50 to-indigo-100 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 overflow-hidden">
          {/* Left Column - Registration Form */}
          <div className="p-10">
            <h2 className="text-3xl font-extrabold text-indigo-700 text-center mb-6">
              Create an Account
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-300"
                required
              />
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-300"
                required
              />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-300"
                required
              />
              <input
                type="text"
                name="mobile"
                placeholder="Mobile Number"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-300"
                required
              />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:ring-4 focus:ring-indigo-300"
                autoComplete="new-password"
                required
              />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full px-5 py-2 rounded-xl border border-gray-300"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full mx-auto border"
                />
              )}

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={loading}
                className={`w-full py-3 rounded-xl font-semibold shadow-lg transition duration-300 text-white ${
                  loading
                    ? 'bg-indigo-400 cursor-not-allowed'
                    : 'bg-indigo-600 hover:bg-indigo-700'
                }`}>
                {loading ? 'Registering...' : 'Register'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                type="button"
                className="w-full bg-indigo-300 hover:bg-indigo-500 text-white py-3 rounded-xl font-semibold">
                Go Back to Home
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/adminRegister')}
                type="button"
                className="w-full bg-red-400 hover:bg-red-500 text-white py-3 rounded-xl font-semibold">
                Register as Admin
              </motion.button>
            </form>
          </div>

          {/* Right Column - Google + Login Link */}
          <div
            className="flex flex-col items-center justify-center bg-cover bg-center bg-no-repeat bg-black/80 p-6 text-white"
            style={{ backgroundImage: `url(${img1})` }}>
            <div className="w-full max-w-xs text-center">
              <p className="text-black mb-3">Or register with</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleLogin}
                className="flex items-center justify-center w-full bg-white border border-gray-300 rounded-xl py-3 text-gray-700 font-semibold shadow-md hover:shadow-lg transition mb-6">
                <svg
                  className="w-6 h-6 mr-2"
                  viewBox="0 0 533.5 544.3"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M533.5 278.4c0-17.7-1.6-35-4.7-51.7H272v97.9h146.8c-6.4 34.6-25.8 63.9-55.3 83.4v69.4h89.4c52.2-48 82.6-119 82.6-198.9z"
                    fill="#4285F4"
                  />
                  <path
                    d="M272 544.3c74.0 0 136.7-24.6 182.2-66.8l-89.4-69.4c-24.8 16.7-56.6 26.6-92.8 26.6-71.3 0-131.8-48-153.6-112.9H26.7v70.7c45.4 89.3 138.9 151.8 245.3 151.8z"
                    fill="#34A853"
                  />
                  <path
                    d="M118.4 323.8c-10.3-30.7-10.3-63.9 0-94.6V158.5H26.7c-37.3 74.3-37.3 162.9 0 237.2l91.7-71.9z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M272 107.7c39.7 0 75.4 13.7 103.5 40.7l77.6-77.6C408.2 24.6 345.9 0 272 0 165.5 0 72 62.5 26.7 152.7l91.7 70.8c21.7-64.8 82.2-112.9 153.6-112.9z"
                    fill="#EA4335"
                  />
                </svg>
                Login with Google
              </motion.button>
              <p>
                Already have an account?{' '}
                <Link
                  to="/userLogin"
                  className="text-indigo-300 hover:underline font-semibold">
                  Login
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </>
  );
};

export default UserRegister;
