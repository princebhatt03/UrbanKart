const jwt = require('jsonwebtoken');

const generateAdminToken = admin => {
  return jwt.sign(
    { id: admin._id, role: 'admin' },
    process.env.JWT_SECRET || 'your_jwt_secret',
    { expiresIn: '1d' }
  );
};

module.exports = generateAdminToken;
