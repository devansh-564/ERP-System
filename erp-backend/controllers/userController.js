const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route  POST /api/tenant/users
const createUser = async (req, res) => {
  try {
    const { name, email, password, role, tenantId } = req.body;

    if (!tenantId) {
      return res.status(400).json({ message: 'tenantId is required' });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
      role: role || 'employee',
      tenantId
    });

    await user.save();

    res.status(201).json({
      message: 'User created ✅',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId
      }
    });
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/tenant/users/:tenantId
const getTenantUsers = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const users = await User.find({ tenantId }).select('-password');
    res.json({ count: users.length, users });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  DELETE /api/tenant/users/:id
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createUser, getTenantUsers, deleteUser };