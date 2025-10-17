const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  adminUsername: { type: String, required: true, unique: true },
  adminID: {
    type: String,
    required: true,
    unique: true,
  },
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },

  profileImage: {
    type: String,
    default:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTqafzhnwwYzuOTjTlaYMeQ7hxQLy_Wq8dnQg&s',
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

adminSchema.pre('save', function (next) {
  this.updatedAt = new Date();
  next();
});

const Admin = mongoose.model('Admin', adminSchema);
module.exports = Admin;
