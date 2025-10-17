const { oauth2client } = require('../utils/google.config');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');

const googleLogin = async (req, res) => {
  try {
    const { code } = req.query;
    if (!code) {
      return res.status(400).json({ message: 'Missing Google auth code' });
    }

    // 1️⃣ Exchange code for tokens
    const { tokens } = await oauth2client.getToken(code);
    oauth2client.setCredentials(tokens);

    const accessToken = tokens.access_token;
    if (!accessToken) {
      return res
        .status(401)
        .json({ message: 'Failed to retrieve access token' });
    }

    // 2️⃣ Fetch user info from Google
    const googleUserRes = await axios.get(
      'https://openidconnect.googleapis.com/v1/userinfo',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { email, name, picture } = googleUserRes.data;

    if (!email) {
      return res.status(400).json({ message: 'Google user info incomplete' });
    }

    // 3️⃣ Check if user already exists
    let user = await UserModel.findOne({ email });

    if (!user) {
      // 3A. Create new user with dummy values for required fields
      const randomSuffix = Math.floor(Math.random() * 10000);
      const defaultUsername = `google_user_${randomSuffix}`;
      const defaultMobile = `0000000000`;
      const defaultPassword = `${Math.random()
        .toString(36)
        .slice(-8)}_GoogleAuth`;

      user = await UserModel.create({
        fullName: name || 'Google User',
        username: defaultUsername,
        email,
        mobile: defaultMobile,
        password: defaultPassword,
        profileImage: picture || '',
      });
    }

    // 4️⃣ Create and sign JWT token
    const token = jwt.sign(
      { id: user._id, email: user.email, role: 'user' }, 
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return res.status(200).json({
      message: '✅ Google login successful',
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        profileImage: user.profileImage,
        username: user.username,
        password: user.password,
      },
    });
  } catch (error) {
    console.error(
      '❌ Google Login Error:',
      error.response?.data || error.message || error
    );
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  googleLogin,
};
