import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
  {
    vendorEmail: { type: String, required: true, index: true },
    vendorName: { type: String, default: '' },
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, default: '' },
  },
  { timestamps: true }
);

// Ensure 1 review per student per vendor
ReviewSchema.index({ vendorEmail: 1, student: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
export default Review;
