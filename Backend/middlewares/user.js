const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';

function isUserLoggedIn(req, res, next) {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization token missing' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Attach user info (id, etc.)
    next();
  } catch (error) {
    console.error('JWT Verification Error:', error.message);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
}

module.exports = isUserLoggedIn;
