import VendorApplication from '../models/VendorApplication.js';
import Vendor from '../models/Vendor.js';
import { sendApprovalEmail, sendRejectionEmail } from '../utils/mailer.js';

// Get all vendor applications
export const getAllApplications = async (req, res) => {
  try {
    const { status } = req.query; // Filter by status: pending, approved, rejected
    
    console.log('📋 Fetching applications. Filter:', status || 'all');
    
    const filter = status ? { status } : {};
    const applications = await VendorApplication.find(filter).sort({ createdAt: -1 });

    console.log(`✅ Found ${applications.length} applications`);

    res.status(200).json({ 
      success: true, 
      count: applications.length,
      data: applications 
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching applications.' 
    });
  }
};

// Get single application by ID
export const getApplicationById = async (req, res) => {
  try {
    const { applicationId } = req.params;
    
    console.log('🔍 Fetching application:', applicationId);
    
    const application = await VendorApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ 
      success: true, 
      data: application 
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching the application.' 
    });
  }
};

// Approve vendor application
export const approveApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;

    console.log('✅ Approving application:', applicationId);
    console.log('👤 Admin:', req.adminEmail);

    // Find the application
    const application = await VendorApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Check if application is already approved
    if (application.status === 'approved') {
      return res.status(400).json({ success: false, message: 'Application already approved' });
    }

    // Check if vendor already exists with this email or contact
    const existingVendor = await Vendor.findOne({
      $or: [{ email: application.email }, { contactNumber: application.contactNumber }]
    });

    if (existingVendor) {
      return res.status(400).json({ 
        success: false, 
        message: 'Vendor with this email or contact number already exists' 
      });
    }

    // Create vendor account with ALL application data (no password - vendors use OTP)
    const newVendor = new Vendor({
      name: application.name,
      email: application.email,
      contactNumber: application.contactNumber,
      messName: application.messName,
      address: application.address,
      city: application.city,
      pincode: application.pincode,
      gstinOrImages: application.gstinOrImages,
      gstinNumber: application.gstinNumber,
      restaurantImages: application.restaurantImages,
      isApproved: true,
      approvedAt: new Date()
    });

    await newVendor.save();
    console.log('✅ Vendor account created:', newVendor.email);

    // Update application status to approved
    application.status = 'approved';
    await application.save();

    // Send approval email (OTP-based login)
    try {
      await sendApprovalEmail(application.email, application.name);
      console.log('📧 Approval email sent to:', application.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send approval email:', emailError.message);
      // Continue even if email fails
    }

    res.status(201).json({ 
      success: true, 
      message: 'Vendor application approved successfully!',
      vendor: {
        id: newVendor._id,
        email: newVendor.email,
        name: newVendor.name,
        messName: newVendor.messName,
      }
    });
  } catch (error) {
    console.error('Error approving application:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while approving the application.',
      error: error.message 
    });
  }
};

// Reject vendor application
export const rejectApplication = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { reason } = req.body; // Optional rejection reason

    console.log('❌ Rejecting application:', applicationId);
    console.log('👤 Admin:', req.adminEmail);

    const application = await VendorApplication.findById(applicationId);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Store application data before deletion
    const applicationData = {
      email: application.email,
      name: application.name,
    };

    // Send rejection email before deleting
    try {
      await sendRejectionEmail(applicationData.email, applicationData.name, reason);
      console.log('📧 Rejection email sent to:', applicationData.email);
    } catch (emailError) {
      console.error('⚠️ Failed to send rejection email:', emailError.message);
      // Continue even if email fails
    }

    // Delete the application from database
    await VendorApplication.findByIdAndDelete(applicationId);
    console.log('🗑️ Application deleted from database');

    res.status(200).json({ 
      success: true, 
      message: 'Application rejected and deleted successfully',
      reason: reason || 'No reason provided'
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while rejecting the application.' 
    });
  }
};

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
  try {
    const pendingCount = await VendorApplication.countDocuments({ status: 'pending' });
    const approvedCount = await VendorApplication.countDocuments({ status: 'approved' });
    const rejectedCount = await VendorApplication.countDocuments({ status: 'rejected' });
    const totalVendors = await Vendor.countDocuments();

    res.status(200).json({
      success: true,
      data: {
        pending: pendingCount,
        approved: approvedCount,
        rejected: rejectedCount,
        totalVendors: totalVendors,
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ 
      success: false, 
      message: 'An error occurred while fetching statistics.' 
    });
  }
};
