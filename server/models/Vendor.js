import mongoose from "mongoose";

const VendorSchema = new mongoose.Schema({
  // Personal Details
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contactNumber: { type: String, required: true, unique: true },
  password: { type: String, required: false }, // Optional - vendors use OTP login
  
  // Professional Details (from VendorApplication)
  messName: { type: String, default: '' },
  address: { type: String, default: '' },
  city: { type: String, default: '' },
  pincode: { type: String, default: '' },
  
  // GSTIN Details
  gstinOrImages: { type: String, enum: ['gstin', 'images', ''], default: '' },
  gstinNumber: { type: String, default: '' },
  restaurantImages: [{ type: String }], // Array of Cloudinary URLs
  
  // Status
  isApproved: { type: Boolean, default: true },
  approvedAt: { type: Date, default: Date.now }
}, { timestamps: true });

const Vendor = mongoose.models.Vendor || mongoose.model('Vendor', VendorSchema);

export default Vendor;