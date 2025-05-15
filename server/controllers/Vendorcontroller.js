import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.js';
import Menu from '../models/Menu.js';

// Register Controller
export const register = async (req, res) => {
  try {
    const { name, contactNumber ,email, password } = req.body;

    if (!name || !contactNumber || !email || !password) {
      return res.status(400).json({ success: false, message: 'Missing required details' });
    }

    const existingVendor = await Vendor.findOne({
      $or: [{ email }, { contactNumber }]
    });
    
    if (existingVendor) {
      return res.status(409).json({
        success: false,
        message: "Email or contact number already exists"
      });
    }
    
    if (existingVendor) {
      return res.status(409).json({ success: false, message: 'Vendor already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newVendor = await Vendor.create({ name,contactNumber, email, password: hashedPassword });

    const token = jwt.sign({ id: newVendor._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('Vendorlogintoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return res.status(201).json({
      success: true,
      vendor: { email: newVendor.email, name: newVendor.name , contactNumber: newVendor.contactNumber},
    });
  } catch (error) {
    console.error('Register Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, vendor.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: vendor._id }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.cookie('Vendorlogintoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      token,
      vendor: {
        email: vendor.email,
        name: vendor.name,
        contactNumber: vendor.contactNumber,
      },
    });
  } catch (error) {
    console.error('Login Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};


// Auth Check
export const isAuth = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.VendorId).select('-password');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    return res.status(200).json({ success: true, vendor });
  } catch (error) {
    console.error('Auth Check Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Logout Controller
export const logout = async (req, res) => {
  try {
    res.clearCookie('Vendorlogintoken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Save or Update Menu
export const saveMenu = async (req, res) => {
  try {
    const { vendorEmail, vendorName, date, day, meals } = req.body;

    let menu = await Menu.findOne({ vendorEmail, date });

    if (menu) {
      menu.day = day;
      menu.meals = meals;
      await menu.save();

      setMenuCookie(res);
      return res.status(200).json({ success: true, message: 'Menu updated', data: menu });
    }

    menu = new Menu({ vendorEmail, vendorName, date, day, meals });
    await menu.save();

    setMenuCookie(res);
    return res.status(201).json({ success: true, message: 'Menu saved', data: menu });

  } catch (error) {
    console.error('Save Menu Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper to set menu cookie
const setMenuCookie = (res) => {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setDate(now.getDate() + 1);
  midnight.setHours(0, 0, 0, 0);

  res.cookie('menuToken', 'menu-session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    expires: midnight,
  });
};

// Get Vendor Menu
export const getMenu = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.VendorId);
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const menu = await Menu.findOne({ vendorEmail: vendor.email });
    if (!menu) return res.status(404).json({ success: false, message: 'No menu found' });

    return res.status(200).json({ success: true, data: menu });
  } catch (error) {
    console.error('Get Menu Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Delete Menu
export const deleteMenu = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.VendorId).select('email');
    if (!vendor) return res.status(404).json({ success: false, message: 'Vendor not found' });

    const result = await Menu.deleteOne({ vendorEmail: vendor.email });

    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'No menu found to delete' });
    }

    res.clearCookie('menuToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.status(200).json({ success: true, message: 'Menu deleted successfully' });
  } catch (error) {
    console.error('Delete Menu Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Menu by Vendor Email
export const getMenuByEmail = async (req, res) => {
  try {
    const vendorEmail = req.params.email;

    const vendor = await Vendor.findOne({ email: vendorEmail });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    const menu = await Menu.findOne({ vendorEmail });
    if (!menu) {
      return res.status(404).json({ success: false, message: 'Menu not found for this vendor' });
    }

    return res.status(200).json({ success: true, data: menu });
  } catch (error) {
    console.error('Get Menu By Email Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
