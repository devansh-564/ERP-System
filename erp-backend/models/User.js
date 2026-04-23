const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ['admin', 'manager', 'employee'],
    default: 'employee'
  },
  // 🔑 HEART OF MULTI-TENANCY
  tenantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Tenant',
    required: true
  },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

// NO pre-save hook — we hash manually in controller

module.exports = mongoose.model('User', userSchema);