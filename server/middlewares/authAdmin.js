import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  try {
    // Get token from Authorization header or cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies?.Vendorlogintoken;
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access denied. No token provided.' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user is admin
    if (decoded.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Access denied. Admin privileges required.' 
      });
    }

    // Attach admin info to request
    req.adminId = decoded.id;
    req.adminEmail = decoded.email;
    req.role = decoded.role;
    
    console.log('✅ Admin authenticated:', decoded.email);
    next();
  } catch (error) {
    console.error('Admin auth error:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Invalid or expired token.' 
    });
  }
};

export default authAdmin;
