import Review from '../models/Review.js';
import Student from '../models/Student.js';

// Get reviews for a vendor (by email)
export const getReviewsByVendor = async (req, res) => {
  try {
    const { vendorEmail } = req.params;
    if (!vendorEmail) return res.status(400).json({ success: false, message: 'vendorEmail is required' });

    // Pagination params
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 50);
    const skip = (page - 1) * limit;

    // Stats via aggregation
    const [stats] = await Review.aggregate([
      { $match: { vendorEmail } },
      { $group: { _id: null, count: { $sum: 1 }, averageRating: { $avg: '$rating' } } }
    ]);

    const count = stats ? stats.count : 0;
    const average = stats ? Number((stats.averageRating || 0).toFixed(2)) : 0;

    // Paginated list
    const reviews = await Review.find({ vendorEmail })
      .populate('student', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const hasMore = skip + reviews.length < count;

    return res.json({ success: true, data: { reviews, averageRating: average, count, page, limit, hasMore } });
  } catch (error) {
    console.error('Get Reviews Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch reviews' });
  }
};

// Create or update student's review for a vendor
export const upsertReview = async (req, res) => {
  try {
    const { vendorEmail } = req.params;
    const { rating, comment = '' } = req.body;
    const studentId = req.StudentId;

    if (!vendorEmail) return res.status(400).json({ success: false, message: 'vendorEmail is required' });
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, message: 'rating must be between 1 and 5' });
    }

    // Get student's info for display name if needed
    const student = await Student.findById(studentId).select('name email');

    const doc = await Review.findOneAndUpdate(
      { vendorEmail, student: studentId },
      { vendorEmail, rating, comment, vendorName: req.body.vendorName || '' },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    const populated = await doc.populate('student', 'name email');

    return res.status(201).json({ success: true, data: populated });
  } catch (error) {
    console.error('Upsert Review Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to save review' });
  }
};

// Delete student's review for a vendor
export const deleteOwnReview = async (req, res) => {
  try {
    const { vendorEmail } = req.params;
    const studentId = req.StudentId;

    const deleted = await Review.findOneAndDelete({ vendorEmail, student: studentId });

    if (!deleted) return res.status(404).json({ success: false, message: 'Review not found' });

    return res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    console.error('Delete Review Error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete review' });
  }
};
