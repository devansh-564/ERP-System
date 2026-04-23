const express = require('express');
const router = express.Router();
const { protect, superAdminOnly } = require('../middleware/authMiddleware');
const {
  createTenant,
  getAllTenants,
  getTenantById,
  updateTenant,
  deleteTenant,
  getDashboardStats
} = require('../controllers/adminController');

// All routes below are protected - must be logged in + Super Admin
router.use(protect, superAdminOnly);

router.get('/dashboard', getDashboardStats);
router.post('/tenants', createTenant);
router.get('/tenants', getAllTenants);
router.get('/tenants/:id', getTenantById);
router.put('/tenants/:id', updateTenant);
router.delete('/tenants/:id', deleteTenant);

module.exports = router;