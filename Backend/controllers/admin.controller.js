const Admin = require('../models/admin.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { oauth2client } = require('../utils/google.config');
const axios = require('axios');
const path = require('path');
const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1d';

// Generate JWT Token
function generateAdminToken(admin) {
  return jwt.sign(
    {
      id: admin._id,
      adminUsername: admin.adminUsername,
      adminID: admin.adminID,
      email: admin.email,
      mobile: admin.mobile,
      role: 'admin',
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

function adminController() {
  return {
    // ---------------------- REGISTER ADMIN ----------------------
    async registerAdmin(req, res) {
      const { fullName, adminUsername, adminID, email, mobile, password } =
        req.body;
      const profileImage = req.file ? `/uploads/${req.file.filename}` : '';

      if (
        !fullName ||
        !adminUsername ||
        !adminID ||
        !email ||
        !mobile ||
        !password
      ) {
        return res.status(400).json({ message: 'All fields are required.' });
      }

      try {
        const existing = await Admin.findOne({ adminUsername });
        if (existing) {
          return res
            .status(409)
            .json({ message: 'Admin username already exists.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = new Admin({
          fullName,
          adminUsername,
          adminID,
          email,
          mobile,
          password: hashedPassword,
          profileImage,
        });

        await newAdmin.save();

        return res.status(201).json({
          success: true,
          message: '✅ Admin registered successfully',
          admin: {
            id: newAdmin._id,
            fullName: newAdmin.fullName,
            adminUsername: newAdmin.adminUsername,
            adminID: newAdmin.adminID,
            email: newAdmin.email,
            mobile: newAdmin.mobile,
            profileImage: newAdmin.profileImage,
          },
        });
      } catch (err) {
        console.error('❌ Register Admin Error:', err);
        return res.status(500).json({ message: 'Server Error' });
      }
    },

    // ---------------------- LOGIN ADMIN ----------------------
    async loginAdmin(req, res) {
      const { adminUsername, adminID, password } = req.body;

      if (!adminUsername || !adminID || !password) {
        return res
          .status(400)
          .json({ message: 'All login fields are required.' });
      }

      try {
        const admin = await Admin.findOne({ adminUsername, adminID });
        if (!admin) {
          return res.status(404).json({ message: 'Admin not found.' });
        }

        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
          return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = generateAdminToken(admin);

        return res.status(200).json({
          success: true,
          message: '✅ Login successful',
          token,
          admin: {
            id: admin._id,
            fullName: admin.fullName,
            adminUsername: admin.adminUsername,
            adminID: admin.adminID,
            email: admin.email,
            mobile: admin.mobile,
            profileImage: admin.profileImage,
          },
        });
      } catch (err) {
        console.error('❌ Login Error:', err);
        return res.status(500).json({ message: 'Server Error' });
      }
    },

    // ---------------------- GOOGLE LOGIN ADMIN ----------------------
    async googleLoginAdmin(req, res) {
      try {
        const { code } = req.query;
        if (!code)
          return res.status(400).json({ message: 'Missing Google auth code' });

        const { tokens } = await oauth2client.getToken(code);
        oauth2client.setCredentials(tokens);

        const accessToken = tokens.access_token;
        if (!accessToken)
          return res.status(401).json({ message: 'Access token not found' });

        const googleUser = await axios.get(
          'https://openidconnect.googleapis.com/v1/userinfo',
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );

        const { email, name, picture } = googleUser.data;
        if (!email)
          return res.status(400).json({ message: 'Invalid Google user info' });

        let admin = await Admin.findOne({ email });

        if (!admin) {
          const randomID = `ADMIN${Date.now().toString().slice(-6)}`;
          const randomUsername = `google_admin_${Math.floor(
            Math.random() * 10000
          )}`;
          const dummyPassword = `${Math.random()
            .toString(36)
            .slice(-8)}_GoogleAuth`;

          admin = await Admin.create({
            fullName: name,
            adminUsername: randomUsername,
            adminID: randomID,
            email,
            mobile: '0000000000',
            password: dummyPassword,
            profileImage: picture,
          });
        }

        const token = generateAdminToken(admin);

        return res.status(200).json({
          success: true,
          message: '✅ Google login (admin) successful',
          token,
          admin: {
            _id: admin._id,
            fullName: admin.fullName,
            adminUsername: admin.adminUsername,
            adminID: admin.adminID,
            email: admin.email,
            mobile: admin.mobile,
            profileImage: admin.profileImage,
            password: admin.password,
          },
        });
      } catch (err) {
        console.error(
          '❌ Google Admin Login Error:',
          err.response?.data || err.message
        );
        return res.status(500).json({ message: 'Google Login Failed' });
      }
    },

    // ---------------------- LOGOUT ADMIN ----------------------
    logoutAdmin(req, res) {
      return res.status(200).json({
        success: true,
        message: '✅ Admin logged out. Please clear token on client side.',
      });
    },

    // ---------------------- UPDATE ADMIN PROFILE ----------------------
    async updateAdminProfile(req, res) {
      try {
        const admin = req.admin;
        if (!admin)
          return res.status(404).json({ message: 'Admin not found.' });

        const { fullName, username, email, mobile, password, currentPassword } =
          req.body;

        // Basic profile updates
        if (fullName) admin.fullName = fullName;
        if (username) admin.adminUsername = username;
        if (email) admin.email = email;
        if (mobile) admin.mobile = mobile;

        // Handle password update (skip for Google-auth admins)
        if (password && !admin.password.endsWith('_GoogleAuth')) {
          if (!currentPassword)
            return res
              .status(400)
              .json({ message: 'Current password is required.' });

          const isMatch = await bcrypt.compare(currentPassword, admin.password);
          if (!isMatch)
            return res
              .status(401)
              .json({ message: 'Incorrect current password.' });

          admin.password = await bcrypt.hash(password, 10);
        }

        // Handle profile image update
        if (req.file) {
          // Always save as a relative path like /uploads/filename.jpg
          admin.profileImage = `/uploads/${req.file.filename}`;
        }

        // Save and send updated token
        await admin.save();
        const token = generateAdminToken(admin);

        res.status(200).json({ success: true, admin, token });
      } catch (err) {
        console.error('❌ Admin Update Error:', err);
        res.status(500).json({ message: 'Server error.' });
      }
    },

    // ---------------------- DELETE ADMIN ----------------------
    async deleteAdmin(req, res) {
      try {
        const adminId = req.params.id;
        const password = req.body?.password;

        if (!req.admin || req.admin._id.toString() !== adminId) {
          return res.status(403).json({ message: 'Unauthorized access.' });
        }

        const admin = await Admin.findById(adminId);
        if (!admin) {
          return res.status(404).json({ message: 'Admin not found.' });
        }

        const isGoogleAdmin = admin.password?.includes('_GoogleAuth');

        if (!isGoogleAdmin) {
          if (!password) {
            return res.status(400).json({ message: 'Password required.' });
          }

          const isMatch = await bcrypt.compare(password, admin.password);
          if (!isMatch) {
            return res.status(401).json({ message: 'Incorrect password.' });
          }
        }

        await Admin.findByIdAndDelete(adminId);

        return res.status(200).json({
          success: true,
          message: '✅ Admin account deleted successfully.',
        });
      } catch (err) {
        console.error('❌ Delete Admin Error:', err);
        return res.status(500).json({ message: 'Server Error' });
      }
    },
  };
}

module.exports = adminController;
