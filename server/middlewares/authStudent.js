import jwt from 'jsonwebtoken';

const authStudent = async (req, res, next) => {
  const token = req.cookies?.Studentlogintoken;

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not Authorized, token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (decoded?.id) {
      req.StudentId = decoded.id;
      next();
    } else {
      return res.status(401).json({ success: false, message: 'Not Authorized, invalid payload' });
    }
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired token' });
  }
};

export default authStudent;
