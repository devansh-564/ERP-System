const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  createItem,
  getInventory,
  updateItem,
  deleteItem,
  getInventoryStats
} = require('../controllers/inventoryController');

router.use(protect);

router.post('/:tenantId', createItem);
router.get('/:tenantId', getInventory);
router.get('/:tenantId/stats', getInventoryStats);
router.put('/:tenantId/:id', updateItem);
router.delete('/:tenantId/:id', deleteItem);

module.exports = router;