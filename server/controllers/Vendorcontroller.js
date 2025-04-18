import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.js';

// Register Controller
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: 'Missing details' });
    }

    const existingVendor = await Vendor.findOne({ email });

    if (existingVendor)
      return res.json({ success: false, message: 'Vendor already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newVendor = await Vendor.create({ name, email, password: hashedPassword });

    const token = jwt.sign({ id: newVendor._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, Vendor: { email: newVendor.email, name: newVendor.name } });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({ success: false, message: 'Email and password are required' });

    const vendor = await Vendor.findOne({ email });
    if (!vendor)
      return res.json({ success: false, message: 'Invalid email or password' });

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch)
      return res.json({ success: false, message: 'Invalid email or password' });

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, Vendor: { email: vendor.email, name: vendor.name } });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Auth Check
export const isAuth = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.VendorId).select('-password');
    return res.json({ success: true, Vendor });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};



// Logout Controller
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({ success: true, message: 'Logged Out' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
