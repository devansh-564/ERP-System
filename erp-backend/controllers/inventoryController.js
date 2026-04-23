const Inventory = require('../models/Inventory');

// @route  POST /api/inventory
// @desc   Create inventory item
const createItem = async (req, res) => {
  try {
    const { name, description, category, quantity, price, unit } = req.body;
    const { tenantId } = req.params;

    // Auto set status based on quantity
    let status = 'in-stock';
    if (quantity === 0) status = 'out-of-stock';
    else if (quantity <= 10) status = 'low-stock';

    const item = await Inventory.create({
      name, description, category,
      quantity, price, unit, status,
      tenantId
    });

    res.status(201).json({ message: 'Item created ✅', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/inventory/:tenantId
// @desc   Get all inventory items for a tenant
const getInventory = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const items = await Inventory.find({ tenantId }).sort({ createdAt: -1 });
    res.json({ count: items.length, items });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  PUT /api/inventory/:tenantId/:id
// @desc   Update inventory item
const updateItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    let updateData = { ...req.body };

    // Auto update status based on quantity
    if (quantity !== undefined) {
      if (quantity === 0) updateData.status = 'out-of-stock';
      else if (quantity <= 10) updateData.status = 'low-stock';
      else updateData.status = 'in-stock';
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item updated ✅', item });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  DELETE /api/inventory/:tenantId/:id
// @desc   Delete inventory item
const deleteItem = async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted ✅' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @route  GET /api/inventory/:tenantId/stats
// @desc   Get inventory stats for a tenant
const getInventoryStats = async (req, res) => {
  try {
    const { tenantId } = req.params;
    const totalItems = await Inventory.countDocuments({ tenantId });
    const inStock = await Inventory.countDocuments({ tenantId, status: 'in-stock' });
    const lowStock = await Inventory.countDocuments({ tenantId, status: 'low-stock' });
    const outOfStock = await Inventory.countDocuments({ tenantId, status: 'out-of-stock' });
    const totalValue = await Inventory.aggregate([
      { $match: { tenantId: require('mongoose').Types.ObjectId(tenantId) } },
      { $group: { _id: null, total: { $sum: { $multiply: ['$price', '$quantity'] } } } }
    ]);

    res.json({
      totalItems,
      inStock,
      lowStock,
      outOfStock,
      totalValue: totalValue[0]?.total || 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { createItem, getInventory, updateItem, deleteItem, getInventoryStats };