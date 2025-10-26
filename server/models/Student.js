import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  // Make contactNumber nullable and unique+sparse so nulls are not indexed
  contactNumber: { type: String, default: null, unique: true, sparse: true },
  password: { type: String, default: '' },
  otpHash: { type: String },
  otpExpiresAt: { type: Date },
});

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

export default Student;
