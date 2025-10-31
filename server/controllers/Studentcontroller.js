// authController.js

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Student from '../models/Student.js';
import Otp from '../models/Otp.js';

// ✅ Register Controller
export const register = async (req, res) => {
  try {
    const { name, contactNumber, email, password } = req.body;

    if (!name || !contactNumber || !email || !password) {
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

    const student = await Student.create({ name, contactNumber, email, password: hashedPassword }); // ✅ lowercase variable

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.json({ success: true, student: { email: student.email, name: student.name, contactNumber: student.contactNumber } });
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
import Review from '../models/Review.js';

// Get all vendors that have menus
export const getAvailableVendors = async (req, res) => {
  try {
    // Find all menus and get unique vendor emails
    const menus = await Menu.find({});
    const vendorEmails = [...new Set(menus.map(menu => menu.vendorEmail))];

    // Get vendor details for each email
    const vendors = await Vendor.find({ email: { $in: vendorEmails } })
      .select('name email contactNumber');

    // Aggregate reviews to compute averages per vendorEmail
    const reviewAgg = await Review.aggregate([
      { $match: { vendorEmail: { $in: vendorEmails } } },
      {
        $group: {
          _id: '$vendorEmail',
          count: { $sum: 1 },
          averageRating: { $avg: '$rating' }
        }
      }
    ]);

    const reviewMap = reviewAgg.reduce((acc, r) => {
      acc[r._id] = { count: r.count, averageRating: Number(r.averageRating?.toFixed(2) || 0) };
      return acc;
    }, {});

    const data = vendors.map(v => ({
      name: v.name,
      email: v.email,
      contactNumber: v.contactNumber,
      averageRating: reviewMap[v.email]?.averageRating || 0,
      reviewCount: reviewMap[v.email]?.count || 0
    }));

    return res.status(200).json({
      success: true,
      data
    });
  } catch (error) {
    console.error('Get Available Vendors Error:', error.message);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Email OTP utilities
import transporter from '../utils/mailer.js';

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Email validation helper function (accept all valid domains)
const isValidEmail = (email) => {
  // Basic RFC5322-like email validation
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

// ✅ Send Email OTP
export const sendStudentEmailOtp = async (req, res) => {
  try {
    const { email } = req.body;
    console.log('Received OTP request for email:', email);

    // Basic validation
    if (!email) {
      console.log('No email provided');
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    // Email validation (accept all domains)
    if (!isValidEmail(email)) {
      console.log('Invalid email format:', email);
      return res.status(400).json({
        success: false,
        message: 'Please enter a valid email address.'
      });
    }

    // Check if student exists without creating a new record
    const student = await Student.findOne({ email });
    const isNewUser = !student;
    
    console.log(`OTP requested for ${isNewUser ? 'new' : 'existing'} user:`, email);

    // Generate OTP
    const otp = generateOtp();
    console.log('Generated OTP for', email, ':', otp);

    // Hash the OTP
    const otpHash = await bcrypt.hash(otp, 10);
    
    // Save OTP in the Otp collection with 5-minute expiration
    await Otp.findOneAndUpdate(
      { email },
      { 
        otp: otpHash,
        createdAt: new Date()
      },
      { upsert: true, new: true }
    );
    
    console.log('OTP saved for email:', email);
    console.log('Sending email via Brevo to:', email);
    
    const mailOptions = {
      from: process.env.EMAIL_FROM || 'EverydayMeal <everydaymeal80@gmail.com>',
      to: email,
      subject: 'Your EveryDayMeal OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Your EveryDayMeal Verification Code</h2>
          <p>Hello,</p>
          <p>Your verification code is: <strong>${otp}</strong></p>
          <p>This code will expire in 5 minutes.</p>
          <p>If you didn't request this code, you can safely ignore this email.</p>
          <p>Best regards,<br>The EveryDayMeal Team</p>
        </div>
      `,
      text: `Your verification code is ${otp}. This code will expire in 5 minutes.`
    };

    await transporter.sendMail(mailOptions);
    console.log('Email sent successfully via SMTP');

    return res.json({
      success: true,
      message: 'OTP sent to email',
      // For testing purposes only - remove in production
      debug: { otp, email }
    });
  } catch (error) {
    console.error('Send Email OTP Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to process OTP request',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// ✅ Update Student Profile
export const updateProfile = async (req, res) => {
  try {
    const { name, contactNumber } = req.body;
    const studentId = req.StudentId; // Set by authStudent middleware

    // Basic validation
    if (!name || !contactNumber) {
      return res.status(400).json({
        success: false,
        message: 'Name and contact number are required'
      });
    }

    // Update the student's profile
    const updatedStudent = await Student.findByIdAndUpdate(
      studentId,
      {
        name: name.trim(),
        contactNumber: contactNumber.trim()
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedStudent) {
      return res.status(404).json({
        success: false,
        message: 'Student not found'
      });
    }

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      student: updatedStudent
    });
  } catch (error) {
    console.error('Profile update error:', error);
    // Handle duplicate key error for unique contactNumber
    // MongoServerError code 11000
    // Example error.keyPattern: { contactNumber: 1 }
    if (error?.code === 11000 && (error.keyPattern?.contactNumber || (error.message || '').includes('contactNumber'))) {
      return res.status(409).json({
        success: false,
        field: 'contactNumber',
        message: 'This phone number is already registered. Please use a different number.'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};


// ✅ Verify Email OTP
export const verifyStudentEmailOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return res.status(400).json({ success: false, message: 'Email and OTP are required' });

    // Find the OTP record
    const otpRecord = await Otp.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired. Please request a new one.' });
    }

    // Check if OTP is expired
    if (otpRecord.createdAt.getTime() + 5 * 60 * 1000 < Date.now()) {
      await Otp.deleteOne({ _id: otpRecord._id });
      return res.status(400).json({ success: false, message: 'OTP expired. Please request a new one.' });
    }

    // Verify OTP
    const isMatch = await bcrypt.compare(otp, otpRecord.otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    // Find or create student
    let student = await Student.findOne({ email });
    let isNewUser = false;

    if (!student) {
      // Create new student with empty profile (use null to cooperate with unique+sparse index)
      student = await Student.create({
        email,
        name: '',
        contactNumber: null
      });
      isNewUser = true;
    }

    // Clean up the used OTP
    await Otp.deleteOne({ _id: otpRecord._id });

    // Generate auth token
    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    // Set HTTP-only cookie
    res.cookie('Studentlogintoken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    // Prepare user check response
    const userCheck = {
      email: student.email,
      hasName: !!student.name && student.name.trim() !== '',
      hasContact: !!student.contactNumber && student.contactNumber.trim() !== '',
      isNewUser: isNewUser || (!student.name && !student.contactNumber),
      isNewUserFlag: isNewUser
    };

    console.log('User check response:', JSON.stringify(userCheck, null, 2));

    return res.json({
      success: true,
      token,
      redirect: userCheck.isNewUser ? '/student/complete-profile' : '/student/dashboard',
      student: {
        email: student.email,
        name: student.name,
        contactNumber: student.contactNumber
      },
      userCheck
    });
  } catch (error) {
    console.error('Verify Email OTP Error:', error.message);
    return res.status(500).json({ success: false, message: 'Failed to verify OTP' });
  }
};
