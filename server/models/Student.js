import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
  name: { type: String, default: '' },
  email: { type: String, required: true, unique: true },
  // Make contactNumber nullable and unique+sparse so nulls are not indexed
  contactNumber: { 
    type: String, 
    required: [true, 'Contact number is required'],
    unique: true,
    trim: true,
    validate: {
      validator: function(v) {
        // Allow temporary contact numbers (starting with TEMP-) or valid 10-digit phone numbers
        return /^TEMP-/.test(v) || /^\d{10}$/.test(v);
      },
      message: props => `${props.value} is not a valid 10-digit phone number!`
    }
  },
  password: { type: String, default: '' },
  otpHash: { type: String },
  otpExpiresAt: { type: Date },
});

const Student = mongoose.models.Student || mongoose.model('Student', StudentSchema);

export default Student;
