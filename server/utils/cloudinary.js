import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.error('No file path provided to uploadOnCloudinary');
      return null;
    }

    // Check if file exists before uploading
    if (!fs.existsSync(localFilePath)) {
      console.error(`File not found: ${localFilePath}`);
      return null;
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: 'auto',
    });

    // Remove the locally saved temporary file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    return response;
  } catch (error) {
    console.error('Error uploading to Cloudinary:', error);
    
    // Try to remove the temporary file even if upload failed
    try {
      if (localFilePath && fs.existsSync(localFilePath)) {
        fs.unlinkSync(localFilePath);
      }
    } catch (unlinkError) {
      console.error('Error removing temporary file:', unlinkError);
    }
    
    return null;
  }
};

export { uploadOnCloudinary };
