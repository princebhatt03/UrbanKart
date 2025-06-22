import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useGoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';

import Header from '../../components/UserHeader';
import Footer from '../../components/Footer';
import img1 from '../../assets/images/login.png';
import { googleAuth } from '../../api';

const UserLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

    if (!formData.username.trim() || !formData.password.trim()) {
      toast.error('Please fill both username and password');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${finalURL}/api/user/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.trim(),
          password: formData.password.trim(),
        }),
      });

      const data = await response.json();

      if (response.ok && data.token && data.user) {
        toast.success('Login successful!');
        localStorage.setItem('userToken', data.token);
        localStorage.setItem('userInfo', JSON.stringify(data.user));
        setTimeout(() => navigate('/'), 2000);
      } else {
        toast.error(data.message || 'Invalid username or password.');
      }
    } catch (error) {
      console.error('Login Error:', error);
      toast.error('⚠️ Server error! Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const responseGoogle = async authResult => {
    setLoading(true);
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

        toast.success('Google login successful!');
        setTimeout(() => navigate('/'), 2000);
      }
    } catch (error) {
      console.error('Google Auth Error:', error);
      toast.error('⚠️ Google login failed. Try again.');
    } finally {
      setLoading(false);
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-white to-pink-100 px-4 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="bg-white p-10 rounded-2xl shadow-2xl w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left Column - Login Form */}
          <div>
            <h2 className="text-3xl font-extrabold text-indigo-700 mb-6 text-center md:text-left">
              Welcome Back
            </h2>

            <form
              onSubmit={handleSubmit}
              className="space-y-5">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
                required
                autoComplete="username"
              />

              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-4 focus:ring-indigo-300 transition"
                required
                autoComplete="current-password"
              />

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
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/adminLogin')}
                type="button"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 rounded-xl font-semibold shadow-lg transition duration-300">
                Login as Admin
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/')}
                type="button"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 py-3 rounded-xl font-semibold shadow-md transition duration-300">
                Go Back to Home
              </motion.button>
            </form>
          </div>

          {/* Right Column - Google & Register */}
          <div
            className="flex bg-cover bg-black/80 bg-center bg-no-repeat flex-col items-center justify-center"
            style={{ backgroundImage: `url(${img1})` }}>
            <div className="w-full max-w-xs text-center">
              <p className="text-gray-600 font-semibold mb-4">Or login with</p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGoogleLogin}
                disabled={loading}
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
                    d="M272 544.3c74.3 0 136.7-24.6 182.2-66.8l-89.4-69.4c-24.8 16.7-56.6 26.6-92.8 26.6-71.3 0-131.8-48-153.6-112.9H26.7v70.7c45.4 89.3 138.9 151.8 245.3 151.8z"
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

              <p className="text-gray-600">
                Don't have an account?{' '}
                <Link
                  to="/userRegister"
                  className="text-indigo-600 font-semibold hover:underline">
                  Register Now
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

export default UserLogin;
