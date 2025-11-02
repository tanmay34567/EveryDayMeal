import { sendOtpEmail } from '../utils/mailer.js';
import Otp from '../models/Otp.js';
import Vendor from '../models/Vendor.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const generateOtp = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const sendOtp = async (req, res) => {
  const { email } = req.body;

  try {
    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not registered. Please apply first.' });
    }

    const otp = generateOtp();
    const otpHash = await bcrypt.hash(otp, 10);
    await Otp.findOneAndUpdate({ email }, { otp: otpHash }, { upsert: true, new: true });

    console.log('Sending OTP email to vendor:', email);
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
    const otpDoc = await Otp.findOne({ email });
    if (!otpDoc) {
      return res.status(400).json({ success: false, message: 'OTP not found or expired. Please request a new one.' });
    }

    const isMatch = await bcrypt.compare(otp, otpDoc.otp);
    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid OTP.' });
    }

    const vendor = await Vendor.findOne({ email });
    if (!vendor) {
      return res.status(404).json({ success: false, message: 'Vendor not found.' });
    }

    await Otp.deleteOne({ email });

    const token = jwt.sign({ id: vendor._id, role: 'vendor' }, process.env.JWT_SECRET, {
      expiresIn: '7d',
    });

    res.status(200).json({ success: true, message: 'Login successful.', token, vendor });
  } catch (error) {
    console.error('Error verifying OTP:', error);
    res.status(500).json({ success: false, message: 'Failed to verify OTP.' });
  }
};
