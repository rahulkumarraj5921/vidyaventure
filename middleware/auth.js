const jwt = require('jsonwebtoken');
const User = require('../models/User');
const memStore = require('../config/memDb');
const { getIsConnected } = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'bihar_state_tourism_secret_key_jwt_2026_secure'
    );

    let user;
    if (getIsConnected()) {
      user = await User.findById(decoded.id).select('-password');
    } else {
      user = memStore.users.find(
        (u) => (u._id && u._id.toString() === decoded.id) || u.id === decoded.id
      );
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    req.user = user;
    req.user.id = user._id ? user._id.toString() : user.id;
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired session token. Please log in again.',
    });
  }
};

// Grant access to specific roles
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `User role '${req.user ? req.user.role : 'guest'}' is not authorized to access this action`,
      });
    }
    next();
  };
};

module.exports = { protect, authorize };
