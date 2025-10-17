import React from 'react';
import { useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-red-100 to-red-200 flex items-center justify-center px-4 py-10">
      <div className="bg-white shadow-2xl rounded-lg p-8 max-w-3xl w-full text-center">
        <h1 className="text-5xl font-extrabold text-red-600 mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-2 text-gray-800">
          Page Not Found
        </h2>
        <p className="text-gray-600 mb-6">
          Sorry, the page you're looking for doesn't exist or has been moved.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 justify-center mt-6">
          {/* User Buttons */}
          <button
            onClick={() => navigate('/userLogin')}
            className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded transition">
            Login as User
          </button>
          <button
            onClick={() => navigate('/userRegister')}
            className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded transition">
            Register as User
          </button>

          {/* Admin Buttons */}
          <button
            onClick={() => navigate('/adminLogin')}
            className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded transition">
            Login as Admin
          </button>
          <button
            onClick={() => navigate('/adminRegister')}
            className="bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition">
            Register as Admin
          </button>

          {/* Home Page */}
          <button
            onClick={() => navigate('/')}
            className="col-span-full bg-gray-800 hover:bg-gray-900 text-white py-2 px-4 rounded transition">
            Go to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
