import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react';
import logo from '../assets/images/logo.png';
import defaultAvatar from '../assets/images/prof.webp';

const AdminHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admin, setAdmin] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [adminName, setAdminName] = useState('Admin');
  const navigate = useNavigate();

  const backendURL =
    import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

  const toggleMenu = () => setMenuOpen(!menuOpen);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    setAdmin(null);
    navigate('/adminLogin');
  };

  useEffect(() => {
    const storedAdmin = localStorage.getItem('adminInfo');
    if (storedAdmin) {
      try {
        const parsedAdmin = JSON.parse(storedAdmin);
        setAdmin(parsedAdmin);

        const isGoogleAdmin = parsedAdmin?.password?.endsWith('_GoogleAuth');
        const name = parsedAdmin.fullName || 'Admin';
        setAdminName(name);

        let imageURL = defaultAvatar;

        if (parsedAdmin.profileImage) {
          if (parsedAdmin.profileImage.startsWith('/uploads/')) {
            imageURL = `${backendURL}${parsedAdmin.profileImage}`;
          } else {
            imageURL = parsedAdmin.profileImage;
          }
        } else if (parsedAdmin.picture) {
          // Fallback for Google OAuth
          imageURL = parsedAdmin.picture;
        }

        setProfileImageUrl(imageURL);
      } catch (error) {
        console.error('Failed to parse admin info:', error);
      }
    } else {
      setAdmin(null);
      setAdminName('Admin');
      setProfileImageUrl(defaultAvatar);
    }
  }, []);

  const navLinks = [
    {
      label: 'Dashboard',
      path: '/adminHome',
      icon: <LayoutDashboard size={18} />,
    },
  ];

  return (
    <header className="bg-white shadow-md w-full sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <Link
          to="/adminHome"
          className="flex items-center">
          <img
            src={logo}
            alt="Logo"
            className="h-12 w-auto"
          />
          <span className="ml-2 text-xl font-bold text-red-600 hidden sm:inline">
            AdminPanel
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
                `flex items-center gap-1 text-gray-700 hover:text-red-500 transition duration-200 ${
                  isActive ? 'font-semibold text-red-600' : ''
                }`
              }>
              {link.icon}
              {link.label}
            </NavLink>
          ))}

          {admin && (
            <div className="flex items-center space-x-4">
              <NavLink
                to="/adminProfile"
                className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
                <img
                  src={profileImageUrl}
                  alt="Admin Profile"
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                />
                <span>{adminName}</span>
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
                  `flex items-center gap-2 text-gray-700 hover:text-red-500 transition-colors duration-200 ${
                    isActive ? 'font-semibold text-red-600' : ''
                  }`
                }>
                {link.icon}
                {link.label}
              </NavLink>
            ))}

            {admin && (
              <>
                <NavLink
                  to="/adminProfile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 text-gray-700 hover:text-purple-600 font-medium">
                  <img
                    src={profileImageUrl}
                    alt="Admin"
                    className="w-8 h-8 rounded-full object-cover border-2 border-purple-500"
                  />
                  <span>{adminName}</span>
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

export default AdminHeader;
