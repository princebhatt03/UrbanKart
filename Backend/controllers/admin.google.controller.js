const { oauth2client } = require('../utils/google.config');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const Admin = require('../models/admin.model');

const googleAdminLogin = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Missing Google auth code' });
    }

    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    const accessToken = tokens.access_token;
    if (!accessToken) {
      return res.status(401).json({ message: 'Access token missing' });
    }

    const googleUserRes = await axios.get(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: { Authorization: `Bearer ${accessToken}` },
      }
    );

    const { email, name, picture } = googleUserRes.data;

    // Check for admin with email
    let admin = await Admin.findOne({ email });

    if (!admin) {
      const randomSuffix = Math.floor(Math.random() * 10000);
      const defaultUsername = `admin_google_${randomSuffix}`;
      const defaultMobile = '0000000000';
      const defaultPassword = `${Math.random()
        .toString(36)
        .slice(-8)}_GoogleAuth`;

      admin = await Admin.create({
        fullName: name || 'Admin Google User',
        adminUsername: defaultUsername,
        adminID: `GOOGLE-${randomSuffix}`,
        email,
        mobile: defaultMobile,
        password: defaultPassword,
        profileImage: picture || '',
      });
    }

    const token = jwt.sign(
      { id: admin._id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: '✅ Google Admin login successful',
      token,
      admin: {
        _id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        profileImage: admin.profileImage,
        adminUsername: admin.adminUsername,
        adminID: admin.adminID,
        password: admin.password,
        mobile: admin.mobile,
      },
    });
  } catch (error) {
    console.error(
      '❌ Google Admin Login Error:',
      error.response?.data || error.message || error
    );
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = { googleAdminLogin };
