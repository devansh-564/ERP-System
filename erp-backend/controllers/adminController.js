const Tenant = require('../models/Tenant');
const User = require('../models/User');
const bcrypt = require('bcryptjs');

// @route  POST /api/admin/tenants
// @desc   Create a new tenant (ERP company)
const createTenant = async (req, res) => {
  try {
    const { companyName, email, phone, plan } = req.body;

    const exists = await Tenant.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: 'Tenant with this email already exists' });
    }

    const tenant = await Tenant.create({
      companyName,
      email,
      phone,
      plan,
      createdBy: req.user.id
    });

    res.status(201).json({ message: 'Tenant created successfully ✅', tenant });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/admin/tenants
// @desc   Get all tenants
const getAllTenants = async (req, res) => {
  try {
    const tenants = await Tenant.find().sort({ createdAt: -1 });
    res.json({ count: tenants.length, tenants });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/admin/tenants/:id
// @desc   Get single tenant
const getTenantById = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json(tenant);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/admin/tenants/:id
// @desc   Update tenant status/plan
const updateTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }
    res.json({ message: 'Tenant updated ✅', tenant });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  DELETE /api/admin/tenants/:id
// @desc   Delete a tenant and all its users
const deleteTenant = async (req, res) => {
  try {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) {
      return res.status(404).json({ message: 'Tenant not found' });
    }

    // Delete all users belonging to this tenant
    await User.deleteMany({ tenantId: req.params.id });

    // Delete the tenant
    await Tenant.findByIdAndDelete(req.params.id);

    res.json({ message: 'Tenant and all its users deleted ✅' });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/admin/dashboard
// @desc   Super admin dashboard stats
const getDashboardStats = async (req, res) => {
  try {
    const totalTenants = await Tenant.countDocuments();
    const activeTenants = await Tenant.countDocuments({ status: 'active' });
    const totalUsers = await User.countDocuments();
    const recentTenants = await Tenant.find().sort({ createdAt: -1 }).limit(5);

    res.json({
      stats: {
        totalTenants,
        activeTenants,
        totalUsers,
        inactiveTenants: totalTenants - activeTenants
      },
      recentTenants
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
  getDashboardStats
};