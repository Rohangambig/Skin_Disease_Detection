require('dotenv').config();

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor =  require('../models/doctor');
 
const protect = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  const role = req.headers.role;

  console.log(token,role)
  if (!token || !role) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, "something");
    
    let user;
    if (role === 'user') {
      // Fetch user from database
      user = await User.findById(decoded.id);
    } else if (role === 'doctor') {
      // Fetch doctor from database
      user = await Doctor.findById(decoded.id);
    }

    if (!user) {
      return res.status(401).json({ message: 'Authorization failed' });
    }

    req.user = user; 
    req.role = role; 
    next();
  } catch (error) {

    console.error('Authorization error : check middleware');
    res.status(401).json({ message: 'Token verification failed' });
  }
};
module.exports = { protect};