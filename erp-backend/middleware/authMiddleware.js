const jwt = require('jsonwebtoken');

// Protect route - verify JWT token
const protect = async (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
};

// Only Super Admin
const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'Super Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied - Super Admin only' });
  }
};

// Any authenticated user
const tenantUserOnly = (req, res, next) => {
  if (req.user && req.user.role !== 'Super Admin') {
    next();
  } else {
    res.status(403).json({ message: 'Access denied' });
  }
};

module.exports = { protect, superAdminOnly, tenantUserOnly };