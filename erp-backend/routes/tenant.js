const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createUser, getTenantUsers, deleteUser } = require('../controllers/userController');

// All routes protected but NOT superAdminOnly
// Tenant admin can also access these
router.use(protect);

router.post('/users', createUser);
router.get('/users/:tenantId', getTenantUsers);
router.delete('/users/:id', deleteUser);

module.exports = router;