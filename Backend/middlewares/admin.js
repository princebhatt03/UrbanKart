const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const isAdminLoggedIn = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Access token required.' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const admin = await Admin.findById(decoded.id);
    if (!admin) {
      return res.status(401).json({ message: 'Not authorized as admin.' });
    }

    // Attach admin and id for downstream usage
    req.admin = admin;
    req.adminId = admin._id; // ✅ Explicit for controller use

    next();
  } catch (error) {
    console.error('Admin token verification failed:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = isAdminLoggedIn;
