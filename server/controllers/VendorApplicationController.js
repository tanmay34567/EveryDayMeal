import VendorApplication from '../models/VendorApplication.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';

const validateInput = (body, req) => {
    const { name, contactNumber, email, messName, address, city, pincode, gstinOrImages, gstinNumber } = body;
    const errors = [];

    const regex = {
        name: /^[A-Za-z ]{3,40}$/,
        contactNumber: /^\d{10}$/,
        email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,4}$/,
        pincode: /^\d{6}$/,
        gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    };

    if (!name || !regex.name.test(name)) errors.push("Enter a valid name (3–40 alphabets only).");
    if (!contactNumber || !regex.contactNumber.test(contactNumber)) errors.push("Contact number must be exactly 10 digits.");
    if (!email || !regex.email.test(email)) errors.push("Enter a valid email address.");
    if (!messName || !messName.trim()) errors.push("Mess/Restaurant name is required.");
    if (!address || !address.trim()) errors.push("Address is required.");
    if (!city || !city.trim()) errors.push("City name is required.");
    if (!pincode || !regex.pincode.test(pincode)) errors.push("Enter a valid 6-digit pincode.");
    if (gstinOrImages === 'gstin' && (!gstinNumber || !regex.gstin.test(gstinNumber))) {
        errors.push("Enter a valid 15-character GSTIN number.");
    }
    if (gstinOrImages === 'images') {
        if (!req.files || req.files.length === 0) {
            errors.push('Please upload at least 3 restaurant images.');
        } else if (req.files.length < 3) {
            errors.push(`Please upload at least 3 restaurant images. Currently uploaded: ${req.files.length}.`);
        }
    }

    return errors;
};

export const apply = async (req, res) => {
  console.log("Incoming Body:", req.body);
  console.log("Incoming Files:", req.files);
  try {
    const validationErrors = validateInput(req.body, req);
    if (validationErrors.length > 0) {
        return res.status(400).json({ success: false, message: validationErrors.join(' ') });
    }

    const { name, contactNumber, email, messName, address, city, pincode, gstinOrImages, gstinNumber } = req.body;

    const existingApplication = await VendorApplication.findOne({ email });
    if (existingApplication) {
      return res.status(400).json({ success: false, message: 'An application with this email already exists.' });
    }

    let imageUrls = [];
    if (gstinOrImages === 'images' && req.files && req.files.length > 0) {
      for (const file of req.files) {
        try {
          if (!file.path) {
            console.error('File path is missing for file:', file.originalname);
            continue;
          }
          const result = await uploadOnCloudinary(file.path);
          if (result && result.secure_url) {
            imageUrls.push(result.secure_url);
          } else {
            console.error('Failed to upload file to Cloudinary:', file.originalname);
          }
        } catch (error) {
          console.error('Error processing file upload:', error);
          // Continue with other files even if one fails
        }
      }
      // Validate that at least 3 images were successfully uploaded
      if (imageUrls.length < 3) {
          return res.status(400).json({ 
              success: false, 
              message: `At least 3 images are required. Only ${imageUrls.length} image(s) were successfully uploaded.` 
          });
      }
    }

    const newApplication = new VendorApplication({
      name,
      contactNumber,
      email,
      messName,
      address,
      city,
      pincode,
      gstinOrImages,
      gstinNumber: gstinOrImages === 'gstin' ? gstinNumber : '',
      restaurantImages: imageUrls,
    });

    await newApplication.save();

    res.status(201).json({ success: true, message: 'Application submitted successfully!' });
  } catch (error) {
    console.error('Error submitting vendor application:', error);
    res.status(500).json({ success: false, message: 'An error occurred while submitting the application.' });
  }
};
