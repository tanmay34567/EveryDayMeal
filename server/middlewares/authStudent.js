import jwt from 'jsonwebtoken';

const authStudent = async (req, res, next) => {
  const { token } = req.cookies;

  if (!token) {
    return res.json({ success: false, message: 'Not Authorized' });
  }

  try {
    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);
    if (tokenDecode.id) {
      req.StudentId = tokenDecode.id; // ✅ Fix: attach to req directly
      next();
    } else {
      return res.json({ success: false, message: 'Not Authorized' });
    }
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export default authStudent;
