import { sendOtpEmail } from '../utils/mailer.js';
import Otp from '../models/Otp.js';
import Vendor from '../models/Vendor.js';
import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ADMIN_EMAIL = 'everydaymeal80@gmail.com';
const ADMIN_OTP_RECIPIENT = 'tanmayhtw@gmail.com'; // Real email to receive OTP

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    // Special case for admin login
    if (email === ADMIN_EMAIL) {
      console.log('🔐 Admin login detected for:', email);
      
      // Ensure admin exists in database
      let admin = await Admin.findOne({ email: ADMIN_EMAIL });
      if (!admin) {
        admin = new Admin({ email: ADMIN_EMAIL, role: 'admin' });
        await admin.save();
        console.log('✅ Admin account created');
      }
      
      // Generate real-time OTP for admin
      const otp = generateOtp();
      const otpHash = await bcrypt.hash(otp, 10);
      await Otp.findOneAndUpdate({ email }, { otp: otpHash }, { upsert: true, new: true });
      
      // Send OTP to the actual admin email (tanmayhtw@gmail.com)
      console.log('📧 Sending admin OTP to:', ADMIN_OTP_RECIPIENT);
      console.log('🔐 Generated admin OTP:', otp);
      
      await sendOtpEmail(ADMIN_OTP_RECIPIENT, otp);
      console.log('✅ Admin OTP email sent successfully');
      
      return res.status(200).json({ 
        success: true, 
        message: `Admin OTP sent to ${ADMIN_OTP_RECIPIENT}`,
        isAdmin: true 
      });
    }

    // Regular vendor login
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not registered. Please apply first.' });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    await Otp.findOneAndUpdate({ email }, { otp: otpHash }, { upsert: true, new: true });

    // Log OTP for development/debugging purposes
    console.log('📧 Sending OTP email to vendor:', email);
    console.log('🔐 Generated OTP:', otp);
    
    await sendOtpEmail(email, otp);
    console.log('✅ Vendor OTP email sent successfully');

    res.status(200).json({ success: true, message: 'OTP sent successfully.' });
  } catch (error) {
    console.error('Error sending OTP:', JSON.stringify(error, null, 2));
    res.status(500).json({ success: false, message: 'Failed to send OTP.' });
  }
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    console.log('🔍 Verifying OTP for:', email);
    console.log('🔑 Received OTP:', otp);
    
    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc) {
      console.log('❌ OTP not found in database for:', email);
      return res.status(400).json({ success: false, message: 'OTP not found or expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);
    if (!isMatch) {
      console.log('❌ Invalid OTP provided for:', email);
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }
    
    console.log('✅ OTP verified successfully for:', email);

    // Check if this is admin login
    if (email === ADMIN_EMAIL) {
      const admin = await Admin.findOne({ email: ADMIN_EMAIL });
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin not found.' });
      }

      await Otp.deleteOne({ email });

      console.log('✅ Creating JWT token for admin:', admin.email);
      
      const token = jwt.sign({ 
        id: admin._id, 
        email: admin.email,
        role: 'admin'
      }, process.env.JWT_SECRET, {
        expiresIn: '7d',
      });

      console.log('✅ Admin token created successfully');
      
      return res.status(200).json({ 
        success: true, 
        message: 'Admin login successful.', 
        token, 
        user: { email: admin.email, role: 'admin', isAdmin: true },
        isAdmin: true
      });
    }

    // Regular vendor login
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    await Otp.deleteOne({ email });

    console.log('✅ Creating JWT token for vendor:', vendor.email, 'ID:', vendor._id);
    
    const token = jwt.sign({ 
      id: vendor._id, 
      email: vendor.email,  // Include email in token for fallback lookup
      role: 'vendor' 
    }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    console.log('✅ Token created successfully. Vendor ID in token:', vendor._id);
    
    res.status(200).json({ 
      success: true, 
      message: 'Login successful.', 
      token, 
      vendor,
      isAdmin: false 
    });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP.' });
  }
};
