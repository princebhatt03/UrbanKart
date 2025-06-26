import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

function About() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-100 to-white text-gray-800 p-6 md:p-12">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-5xl mx-auto bg-white shadow-2xl rounded-2xl p-8 md:p-16">
        <motion.h1
          className="text-4xl md:text-5xl font-extrabold text-center text-indigo-600 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}>
          About UrbanKart 🛒
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-center text-gray-700 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}>
          UrbanKart is a modern and powerful full-stack E-Commerce platform
          built using the MERN stack. Designed with user experience and admin
          efficiency in mind, it simplifies online shopping and store
          management.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <motion.div
            className="bg-indigo-50 rounded-xl p-6 shadow-md"
            whileHover={{ scale: 1.02 }}>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              🔧 Tech Stack
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>🌐 Frontend: React.js + Vite</li>
              <li>🎨 Styling: Tailwind CSS</li>
              <li>⚙️ Backend: Node.js + Express.js</li>
              <li>🗃️ Database: MongoDB + Mongoose</li>
              <li>💳 Payments: Razorpay Integration</li>
              <li>📦 Features: Cart, Wishlist, Checkout, Authentication</li>
              <li>🛠️ Admin Panel: Order Management & Inventory Control</li>
            </ul>
          </motion.div>

          <motion.div
            className="bg-indigo-50 rounded-xl p-6 shadow-md"
            whileHover={{ scale: 1.02 }}>
            <h2 className="text-2xl font-bold mb-4 text-indigo-700">
              👨‍💻 Developer Info
            </h2>
            <ul className="space-y-2 text-gray-700">
              <li>
                <strong>Name:</strong> Prince Bhatt
              </li>
              <li>
                <strong>Role:</strong> Full Stack Web Developer
              </li>
              <li>
                <strong>Email:</strong> princebhatt316@gmail.com
              </li>
              <li>
                <strong>GitHub:</strong>{' '}
                <a
                  href="https://github.com/princebhatt03"
                  className="text-indigo-600 hover:underline"
                  target="_blank">
                  princebhatt03
                </a>
              </li>
              <li>
                <strong>LinkedIn:</strong>{' '}
                <a
                  href="https://www.linkedin.com/in/prince-bhatt-0958a725a/"
                  className="text-indigo-600 hover:underline"
                  target="_blank">
                  Prince Bhatt
                </a>
              </li>
              <li>
                <strong>Portfolio:</strong>{' '}
                <a
                  href="https://princebhatt03.github.io/Portfolio"
                  className="text-indigo-600 hover:underline"
                  target="_blank">
                  View My Work
                </a>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}>
          <p className="text-lg mb-4">Want to try the app?</p>
          <Link
            to="/"
            className="inline-block bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold px-6 py-3 rounded-xl transition duration-300 shadow-md">
            Go to Home
          </Link>
        </motion.div>
      </motion.div>
    </main>
  );
}

export default About;
