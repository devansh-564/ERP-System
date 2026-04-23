const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const SuperAdmin = require('../models/SuperAdmin');
const User = require('../models/User');
const Tenant = require('../models/Tenant');

// Generate JWT Token
const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route  POST /api/auth/register-admin
const registerAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await SuperAdmin.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Admin already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const superAdmin = new SuperAdmin({
      name, email,
      password: hashedPassword,
      role: 'Super Admin'
    });

    await superAdmin.save();

    res.status(201).json({
      token: generateToken({
        id: superAdmin._id,
        role: superAdmin.role
      }),
      user: {
        id: superAdmin._id,
        name: superAdmin.name,
        email: superAdmin.email,
        role: superAdmin.role
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  POST /api/auth/login
// @desc   Login for BOTH Super Admin and Tenant Users
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // 1️⃣ Check if Super Admin
    const superAdmin = await SuperAdmin.findOne({ email });
    if (superAdmin) {
      const isMatch = await bcrypt.compare(password, superAdmin.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }
      return res.json({
        token: generateToken({ id: superAdmin._id, role: superAdmin.role }),
        user: {
          id: superAdmin._id,
          name: superAdmin.name,
          email: superAdmin.email,
          role: superAdmin.role
        }
      });
    }

    // 2️⃣ Check if Tenant User
    const user = await User.findOne({ email }).populate('tenantId');
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check if tenant is active
      if (user.tenantId?.status !== 'active') {
        return res.status(403).json({ message: 'Your company account is suspended' });
      }

      return res.json({
        token: generateToken({
          id: user._id,
          role: user.role,
          tenantId: user.tenantId._id
        }),
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          tenantId: user.tenantId._id,
          companyName: user.tenantId.companyName
        }
      });
    }

    return res.status(401).json({ message: 'Invalid email or password' });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { login, registerAdmin };