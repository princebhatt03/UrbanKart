import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import FrontPage from './pages/FrontPage';
import UserRegister from './pages/user/UserRegister';
import UserLogin from './pages/user/UserLogin';
import ErrorPage from './pages/ErrorPage';
import ProtectedRoute from './UserProtectedRoute';
import UserProfileUpdate from './pages/user/UserProfileUpdate';
import UserDelete from './pages/user/UserDelete';
import AdminDelete from './pages/admin/AdminDelete';
import AdminProfileUpdate from './pages/admin/AdminProfileUpdate';
import AdminRegister from './pages/admin/AdminRegister';
import AdminLogin from './pages/admin/AdminLogin';
import AdminHome from './pages/admin/AdminHome';
import AdminProtectedRoute from './AdminProtectedRoutes';
import AddProduct from './pages/products/AddProducts';
import EditProduct from './pages/products/EditProduct';
import Cart from './pages/products/Cart';
import About from './pages/About';
import Contact from './pages/Contact';
import Shop from './pages/products/Shop';
import CheckoutPage from './pages/products/Checkout';
import FAQPage from './components/FAGPage';
import Orders from './pages/MyOrdersPage';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const info = localStorage.getItem('userInfo');
    if (info) setUser(JSON.parse(info));
  }, []);

  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const GoogleAuthWrapper = () => (
    <GoogleOAuthProvider clientId={clientId}>
      <UserLogin onLogin={setUser} />
    </GoogleOAuthProvider>
  );

  const GoogleAuthWrapper1 = () => (
    <GoogleOAuthProvider clientId={clientId}>
      <UserRegister />
    </GoogleOAuthProvider>
  );

  const GoogleAuthWrapper2 = () => (
    <GoogleOAuthProvider clientId={clientId}>
      <AdminLogin />
    </GoogleOAuthProvider>
  );

  const GoogleAuthWrapper3 = () => (
    <GoogleOAuthProvider clientId={clientId}>
      <AdminRegister />
    </GoogleOAuthProvider>
  );

  return (
    <>
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />

      <Routes>
        <Route
          path="/"
          element={<FrontPage />}
        />
        <Route
          path="/userRegister"
          element={<GoogleAuthWrapper1 />}
        />
        <Route
          path="/userLogin"
          element={<GoogleAuthWrapper />}
        />
        <Route
          path="/userProfile"
          element={
            <ProtectedRoute>
              <UserProfileUpdate />
            </ProtectedRoute>
          }
        />
        <Route
          path="/userDelete"
          element={
            <ProtectedRoute>
              <UserDelete />
            </ProtectedRoute>
          }
        />
        <Route
          path="/shop"
          element={
            <ProtectedRoute>
              <Shop />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={<CheckoutPage />}
        />
        <Route
          path="/about"
          element={<About />}
        />
        <Route
          path="/contact"
          element={<Contact />}
        />
        <Route
          path="/faqs"
          element={<FAQPage />}
        />
        <Route
          path="/adminLogin"
          element={<GoogleAuthWrapper2 />}
        />
        <Route
          path="/adminRegister"
          element={<GoogleAuthWrapper3 />}
        />
        <Route
          path="/adminHome"
          element={
            <AdminProtectedRoute>
              <AdminHome />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/adminProfile"
          element={
            <AdminProtectedRoute>
              <AdminProfileUpdate />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/adminDelete"
          element={
            <AdminProtectedRoute>
              <AdminDelete />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/addProducts"
          element={
            <AdminProtectedRoute>
              <AddProduct />
            </AdminProtectedRoute>
          }
        />
        <Route
          path="/admin/edit/:id"
          element={<EditProduct />}
        />
        <Route
          path="*"
          element={<ErrorPage />}
        />
      </Routes>
    </>
  );
}

export default App;

// Testing Commit