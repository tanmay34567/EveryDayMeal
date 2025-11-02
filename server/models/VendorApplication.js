import mongoose from 'mongoose';

const vendorApplicationSchema = new mongoose.Schema({
  // Personal Details
  name: { type: String, required: true },
  contactNumber: { type: String, required: true },
  email: { type: String, required: true, unique: true },

  // Professional Details
  messName: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  pincode: { type: String, required: true },

  // GSTIN Details
  gstinOrImages: { type: String, required: true, enum: ['gstin', 'images'] },
  gstinNumber: { type: String, default: '' },
  restaurantImages: [{ type: String }], // Array of Cloudinary URLs

  // Application Status
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
}, { timestamps: true });

const VendorApplication = mongoose.model('VendorApplication', vendorApplicationSchema);

export default VendorApplication;
