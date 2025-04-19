import jwt from 'jsonwebtoken';

const authVendor = (req, res, next) => {
  // Try getting token from cookie first
  let token = req.cookies?.Vendorlogintoken;

  // Fallback to Authorization header if not in cookie
  if (!token && req.headers.authorization) {
    const bearer = req.headers.authorization.split(' ');
    if (bearer[0] === 'Bearer' && bearer[1]) {
      token = bearer[1];
    }
  }

  // If no token found
  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.VendorId = decoded.id; // Attach decoded vendor ID to request
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authVendor;
