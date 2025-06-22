import { useState, useEffect } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Menu,
  X,
  ShoppingCart,
  Package,
  Home,
  Store,
  LogIn,
  UserPlus,
  LogOut,
} from 'lucide-react';
import logo from '../assets/images/logo.png';
import defaultAvatar from '../assets/images/prof.webp';

const UserHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    setUser(null);
    navigate('/userLogin');
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);

        let imageURL = defaultAvatar;

        if (parsedUser.profileImage) {
          if (parsedUser.profileImage.startsWith('/uploads/')) {
            imageURL = `${backendURL}${parsedUser.profileImage}`;
          } else {
            imageURL = parsedUser.profileImage;
          }
        } else if (parsedUser.picture) {
          // Google OAuth fallback
          imageURL = parsedUser.picture;
        }

        setProfileImageUrl(imageURL);
      } catch (error) {
        console.error('Failed to parse user info:', error);
      }
    } else {
      setUser(null);
      setProfileImageUrl(null);
    }
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: '/', icon: <Home size={18} /> },
    { label: 'Shop', path: '/shop', icon: <Store size={18} /> },
    { label: 'Order', path: '/orders', icon: <Package size={18} /> },
    { label: 'MyCart', path: '/cart', icon: <ShoppingCart size={18} /> },
  ];

  return (
    <header className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          to="/"
          className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto"
          />
          <span className="ml-2 text-xl font-bold text-[#FF708E] hidden sm:inline">
            UrbanKart
          </span>
        </Link>

        <div className="md:hidden">
          <button
            onClick={toggleMenu}
            className="text-gray-700 focus:outline-none">
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        <nav className="hidden md:flex space-x-6 items-center">
          {navLinks.map(link => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                `flex items-center gap-1 text-gray-700 hover:text-[#FF708E] transition duration-200 ${
                  isActive ? 'font-semibold text-[#FF708E]' : ''
                }`
              }>
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          {!user ? (
            <>
              <NavLink
                to="/userLogin"
                className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium">
                <LogIn size={18} />
                Login
              </NavLink>
              <NavLink
                to="/userRegister"
                className="flex items-center gap-1 text-gray-700 hover:text-green-600 font-medium">
                <UserPlus size={18} />
                Create Account
              </NavLink>
            </>
          ) : (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/userProfile"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
                <img
                  src={profileImageUrl || defaultAvatar}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                />
                <span>{user.fullName || user.name || 'Profile'}</span>
              </NavLink>
              <button
                onClick={handleLogout}
                className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium">
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </nav>
      </div>

      {/* Mobile Nav */}
      {menuOpen && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          className="md:hidden bg-white shadow-lg px-4 pb-4">
          <div className="flex flex-col space-y-2">
            {navLinks.map(link => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-gray-700 hover:text-[#FF708E] transition-colors duration-200 ${
                    isActive ? 'font-semibold text-[#FF708E]' : ''
                  }`
                }>
                {link.icon}
                {link.label}
              </NavLink>
            ))}

            {!user ? (
              <>
                <NavLink
                  to="/userLogin"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1 text-gray-700 hover:text-blue-600 font-medium">
                  <LogIn size={18} />
                  Login
                </NavLink>
                <NavLink
                  to="/userRegister"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-1 text-gray-700 hover:text-green-600 font-medium">
                  <UserPlus size={18} />
                  Create Account
                </NavLink>
              </>
            ) : (
              <>
                <NavLink
                  to="/userProfile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
                  <img
                    src={profileImageUrl || defaultAvatar}
                    alt="Profile"
                    className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                  />
                  <span>{user.fullName || user.name || 'Profile'}</span>
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuOpen(false);
                  }}
                  className="flex items-center gap-1 text-red-500 hover:text-red-700 font-medium">
                  <LogOut size={18} />
                  Logout
                </button>
              </>
            )}
          </div>
        </motion.div>
      )}
    </header>
  );
};

export default UserHeader;
