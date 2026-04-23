const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  name:        { type: String, required: true },
  description: { type: String, default: '' },
  category:    { type: String, required: true },
  quantity:    { type: Number, required: true, default: 0 },
  price:       { type: Number, required: true },
  unit:        { type: String, default: 'pcs' },
  status: {
    type: String,
    enum: ['in-stock', 'low-stock', 'out-of-stock'],
    default: 'in-stock'
  },
  // 🔑 MULTI-TENANCY — each product belongs to a tenant
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);