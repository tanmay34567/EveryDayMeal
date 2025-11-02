import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Vendor from '../models/Vendor.js';
import Menu from '../models/Menu.js';
import Review from '../models/Review.js';

// Helper function to decode JWT token
const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

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

// Get Vendor's own reviews and average
export const getVendorReviews = async (req, res) => {
  try {
    console.log('⭐ Get Vendor Reviews called - VendorId:', req.VendorId);
    
    let vendor = await Vendor.findById(req.VendorId).select('email name');
    
    // If vendor not found by ID, try to find by email from token
    if (!vendor) {
      console.log('⚠️ Vendor not found by ID, trying email fallback...');
      try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.Vendorlogintoken;
        if (token) {
          const decoded = decodeToken(token);
          if (decoded && decoded.email) {
            vendor = await Vendor.findOne({ email: decoded.email }).select('email name');
            if (vendor) {
              console.log('✅ Vendor found by email from token:', vendor.email);
            }
          }
        }
      } catch (tokenError) {
        console.log('⚠️ Could not decode token for email fallback');
      }
      
      if (!vendor) {
        console.log('❌ Vendor not found with ID:', req.VendorId);
        return res.status(404).json({ 
          success: false, 
          message: 'Vendor not found. Your session may have expired.',
          data: {
            averageRating: 0,
            count: 0,
            reviews: []
          }
        });
      }
    }

    console.log('✅ Vendor found for reviews:', vendor.email);

    const [stats] = await Review.aggregate([
      { $match: { vendorEmail: vendor.email } },
      { $group: { _id: null, count: { $sum: 1 }, averageRating: { $avg: '$rating' } } }
    ]);

    const reviews = await Review.find({ vendorEmail: vendor.email })
      .populate('student', 'name email')
      .sort({ createdAt: -1 });

    console.log('📊 Reviews found:', reviews.length);

    return res.status(200).json({
      success: true,
      data: {
        vendor: { email: vendor.email, name: vendor.name },
        averageRating: stats ? Number(stats.averageRating?.toFixed(2) || 0) : 0,
        count: stats ? stats.count : 0,
        reviews
      }
    });
  } catch (error) {
    console.error('❌ Get Vendor Reviews Error:', error.message);
    console.error('Error stack:', error.stack);
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
    console.log('💾 Save Menu called - VendorId:', req.VendorId);
    console.log('📝 Request body:', JSON.stringify(req.body, null, 2));
    
    const vendor = await Vendor.findById(req.VendorId);
    if (!vendor) {
      console.log('❌ Vendor not found with ID:', req.VendorId);
      return res.status(404).json({ success: false, message: 'Vendor not found' });
    }

    // Use vendor email from authenticated user, not from request body for security
    const vendorEmail = vendor.email;
    const { vendorName, date, day, meals } = req.body;

    console.log('🔍 Looking for existing menu for:', vendorEmail, 'date:', date);

    let menu = await Menu.findOne({ vendorEmail, date });

    if (menu) {
      console.log('📝 Updating existing menu');
      menu.day = day;
      menu.meals = meals;
      menu.vendorName = vendorName || vendor.name;
      await menu.save();

      setMenuCookie(res);
      console.log('✅ Menu updated successfully');
      return res.status(200).json({ success: true, message: 'Menu updated', data: menu });
    }

    console.log('➕ Creating new menu');
    menu = new Menu({ 
      vendorEmail: vendorEmail, // Use authenticated vendor's email
      vendorName: vendorName || vendor.name, 
      date, 
      day, 
      meals 
    });
    await menu.save();

    console.log('✅ Menu saved successfully for:', vendorEmail);
    setMenuCookie(res);
    return res.status(201).json({ success: true, message: 'Menu saved', data: menu });

  } catch (error) {
    console.error('❌ Save Menu Error:', error.message);
    console.error('Error stack:', error.stack);
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
    console.log('🍽️ Get Menu called - VendorId:', req.VendorId);
    console.log('🔍 VendorId type:', typeof req.VendorId);
    console.log('🔍 VendorId value:', req.VendorId);
    
    let vendor = await Vendor.findById(req.VendorId);
    
    // If vendor not found by ID, try to get email from token and find by email
    if (!vendor) {
      console.log('⚠️ Vendor not found by ID, checking token for email...');
      try {
        const token = req.headers.authorization?.split(' ')[1] || req.cookies?.Vendorlogintoken;
        if (token) {
          const decoded = decodeToken(token);
          if (decoded) {
            console.log('📧 Decoded token:', JSON.stringify(decoded, null, 2));
            // Try to find vendor by email if available in token
            if (decoded.email) {
              vendor = await Vendor.findOne({ email: decoded.email });
              if (vendor) {
                console.log('✅ Vendor found by email from token:', vendor.email);
              }
            }
          }
        }
      } catch (tokenError) {
        console.log('⚠️ Could not decode token for email fallback');
      }
      
      // If still not found, list some vendors to debug
      if (!vendor) {
        const vendorCount = await Vendor.countDocuments();
        console.log('📊 Total vendors in database:', vendorCount);
        const sampleVendors = await Vendor.find().limit(3).select('_id email name');
        console.log('📋 Sample vendors:', JSON.stringify(sampleVendors, null, 2));
        return res.status(404).json({ 
          success: false, 
          message: 'Vendor not found. Your session may have expired or account was removed.',
          vendorId: req.VendorId,
          debug: {
            vendorCount,
            sampleVendors
          }
        });
      }
    }

    console.log('✅ Vendor found:', vendor.email, 'ID:', vendor._id);

    // Find the most recent menu for this vendor (use find with sort, then limit)
    const menus = await Menu.find({ vendorEmail: vendor.email }).sort({ createdAt: -1 }).limit(1);
    const menu = menus.length > 0 ? menus[0] : null;
    
    console.log('📋 Menu query result:', menu ? 'Menu found' : 'No menu found');
    
    if (!menu) {
      // Return success but with no data - this is expected for new vendors
      console.log('ℹ️ No menu exists for vendor:', vendor.email);
      return res.status(200).json({ 
        success: true, 
        message: 'No menu found',
        data: null 
      });
    }

    console.log('✅ Returning menu data for vendor:', vendor.email);
    return res.status(200).json({ success: true, data: menu });
  } catch (error) {
    console.error('❌ Get Menu Error:', error.message);
    console.error('Error stack:', error.stack);
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
