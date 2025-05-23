// authController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js'; // ✅ Correct import only once

// ✅ Register Controller
export const register = async (req, res) => {
  try {
    const { name, contactNumber, email, password } = req.body;

    if (!name || !contactNumber || !email || !password ) {
      return res.json({ success: false, message: 'Missing details' });
    }

    const existingStudent = await Student.findOne({
      $or: [{ email }, { contactNumber }]
    });
    
    if (existingStudent) {
      return res.json({
        success: false,
        message: "Email or contact number already exists"
      });
    }
    

    if (existingStudent)
      return res.json({ success: false, message: 'User already exists' });

    const hashedPassword = await bcrypt.hash(password, 10);

    const student = await Student.create({ name, contactNumber ,email, password: hashedPassword }); // ✅ lowercase variable

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, student: { email: student.email, name: student.name, contactNumber: student.contactNumber  } });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Login Controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.json({ success: false, message: 'Email and password are required' });

    const student = await Student.findOne({ email });
    if (!student) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, student.password);
    if (!isMatch) {
      return res.json({ success: false, message: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('Studentlogintoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      token,
      student: {
        email: student.email,
        name: student.name,
        contactNumber: student.contactNumber
      }
    });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};


// ✅ isAuth Controller
export const isAuth = async (req, res) => {
  try {
    const student = await Student.findById(req.userId).select('-password');
    return res.json({ success: true, student });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// ✅ Logout Controller
export const logout = async (req, res) => {
  try {
    res.clearCookie('Studentlogintoken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });

    return res.json({ success: true, message: 'Logged Out' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Get all vendors with available menus
import Vendor from '../models/Vendor.js';
import Menu from '../models/Menu.js';

// Get all vendors that have menus
export const getAvailableVendors = async (req, res) => {
  try {
    // Find all menus and get unique vendor emails
    const menus = await Menu.find({});
    const vendorEmails = [...new Set(menus.map(menu => menu.vendorEmail))];
    
    // Get vendor details for each email
    const vendors = await Vendor.find({ email: { $in: vendorEmails } })
      .select('name email contactNumber');
    
    return res.status(200).json({
      success: true,
      data: vendors
    });
  } catch (error) {
    console.error('Get Available Vendors Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};
