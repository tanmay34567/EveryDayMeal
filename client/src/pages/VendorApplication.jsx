import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { api } from "../services";

const VendorApplication = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    contactNumber: "",
    email: "",
    messName: "",
    address: "",
    city: "",
    pincode: "",
    gstinOrImages: "gstin", // 'gstin' or 'images'
    gstinNumber: "",
    restaurantImages: [],
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Regex patterns for validation
  const regex = {
    name: /^[A-Za-z ]{3,40}$/,
    contactNumber: /^[0-9]{10}$/,
    email: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,4}$/,
    pincode: /^[1-9][0-9]{5}$/,
    gstin: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
  };

  // Validation function
  const validate = () => {
    const newErrors = {};

    if (!formData.name || !regex.name.test(formData.name))
      newErrors.name = "Enter a valid name (3–40 alphabets only).";

    if (!regex.contactNumber.test(formData.contactNumber))
      newErrors.contactNumber = "Contact number must be exactly 10 digits.";

    if (!regex.email.test(formData.email))
      newErrors.email = "Enter a valid email address.";

    if (!formData.messName.trim())
      newErrors.messName = "Mess/Restaurant name is required.";

    if (!formData.address.trim())
      newErrors.address = "Address is required.";

    if (!formData.city.trim())
      newErrors.city = "City name is required.";

    if (!regex.pincode.test(formData.pincode))
      newErrors.pincode = "Enter a valid 6-digit pincode.";

    if (formData.gstinOrImages === "gstin") {
      if (!regex.gstin.test(formData.gstinNumber))
        newErrors.gstin = "Enter a valid 15-character GSTIN number.";
    } else {
      if (formData.restaurantImages.length === 0) {
        newErrors.restaurantImages = "Please add at least 3 restaurant images.";
      } else if (formData.restaurantImages.length < 3) {
        newErrors.restaurantImages = `Please add at least 3 restaurant images. Currently uploaded: ${formData.restaurantImages.length}.`;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" }); // Clear field error on change
  };

  // Handle file uploads (minimum 3, maximum 3)
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const totalFiles = formData.restaurantImages.length + files.length;
    
    if (totalFiles > 3) {
      toast.error("You can upload a maximum of 3 images.");
      return;
    }
    
    if (files.length > 0) {
      const newImages = [...formData.restaurantImages, ...files].slice(0, 3); // Ensure max 3
      setFormData({
        ...formData,
        restaurantImages: newImages,
      });
      // Clear the error when at least 3 images are added
      if (newImages.length >= 3) {
        setErrors({ ...errors, restaurantImages: "" });
      }
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = formData.restaurantImages.filter((_, i) => i !== index);
    setFormData({
      ...formData,
      restaurantImages: updatedImages,
    });
    // Clear error if images meet requirement after removal
    if (updatedImages.length >= 3 && errors.restaurantImages) {
      setErrors({ ...errors, restaurantImages: "" });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) {
      toast.error("Please fix validation errors before submitting.");
      return;
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key === "restaurantImages") {
        formData.restaurantImages.forEach((file) =>
          data.append("restaurantImages", file)
        );
      } else {
        data.append(key, formData[key]);
      }
    });

    try {
      const response = await api.post("/api/vendor/apply", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (response.data.success) {
        toast.success("Application submitted successfully!");
        setIsSubmitted(true);
      } else {
        toast.error(response.data.message || "Submission failed.");
      }
    } catch (error) {
      console.error("Response Error:", error.response?.data);
toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-3xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Vendor Application</h1>
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:underline text-sm"
          >
            &larr; Back
          </button>
        </div>

        {isSubmitted ? (
          <div className="text-center py-10">
            <h2 className="text-2xl font-bold text-green-600 mb-4">Application Submitted!</h2>
            <p className="text-gray-600 mb-6">Thank you for applying. We will review your application and get back to you soon.</p>
            <button onClick={() => navigate('/')} className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700">
              Back to Home
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
          {/* Personal & Business Details */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">
              Personal & Business Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`p-2 border rounded w-full ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
              </div>

              {/* Contact */}
              <div>
                <input
                  type="text"
                  name="contactNumber"
                  placeholder="10-digit Contact Number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                  maxLength="10"
                  className={`p-2 border rounded w-full ${
                    errors.contactNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.contactNumber && (
                  <p className="text-red-500 text-xs mt-1">{errors.contactNumber}</p>
                )}
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  value={formData.email}
                  onChange={handleChange}
                  className={`p-2 border rounded w-full ${
                    errors.email ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
              </div>

              {/* Mess Name */}
              <div>
                <input
                  type="text"
                  name="messName"
                  placeholder="Mess/Restaurant Name"
                  value={formData.messName}
                  onChange={handleChange}
                  className={`p-2 border rounded w-full ${
                    errors.messName ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.messName && (
                  <p className="text-red-500 text-xs mt-1">{errors.messName}</p>
                )}
              </div>

              {/* Address */}
              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Full Address"
                  value={formData.address}
                  onChange={handleChange}
                  className={`p-2 border rounded w-full ${
                    errors.address ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.address && (
                  <p className="text-red-500 text-xs mt-1">{errors.address}</p>
                )}
              </div>

              {/* City */}
              <div>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  value={formData.city}
                  onChange={handleChange}
                  className={`p-2 border rounded w-full ${
                    errors.city ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city}</p>}
              </div>

              {/* Pincode */}
              <div>
                <input
                  type="text"
                  name="pincode"
                  placeholder="6-digit Pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  maxLength="6"
                  className={`p-2 border rounded w-full ${
                    errors.pincode ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {errors.pincode && (
                  <p className="text-red-500 text-xs mt-1">{errors.pincode}</p>
                )}
              </div>
            </div>
          </div>

          {/* GSTIN / Images Section */}
          <div className="p-4 border rounded-lg bg-gray-50">
            <h2 className="text-lg font-semibold mb-4 text-gray-700">Business Verification</h2>
            <div className="flex gap-6 mb-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gstinOrImages"
                  value="gstin"
                  checked={formData.gstinOrImages === "gstin"}
                  onChange={handleChange}
                />
                GSTIN Number
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="radio"
                  name="gstinOrImages"
                  value="images"
                  checked={formData.gstinOrImages === "images"}
                  onChange={handleChange}
                />
                Restaurant Images
              </label>
            </div>

            {formData.gstinOrImages === "gstin" ? (
              <input
                type="text"
                name="gstinNumber"
                placeholder="Enter 15-digit GSTIN Number"
                value={formData.gstinNumber}
                onChange={handleChange}
                className={`p-2 border rounded w-full ${
                  errors.gstin ? "border-red-500" : "border-gray-300"
                }`}
              />
            ) : (
              <div>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className={`p-2 border rounded w-full ${
                    errors.restaurantImages ? "border-red-500" : "border-gray-300"
                  }`}
                />
                <p className="text-sm text-gray-600 mt-2">
                  Please upload at least 3 restaurant images ({formData.restaurantImages.length}/3 uploaded)
                </p>
                <div className="mt-3 flex flex-wrap gap-3">
                  {formData.restaurantImages.map((file, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(file)}
                        alt="preview"
                        className="h-20 w-20 object-cover rounded shadow"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
                {errors.restaurantImages && (
                  <p className="text-red-500 text-xs mt-2">{errors.restaurantImages}</p>
                )}
              </div>
            )}
            {errors.gstin && <p className="text-red-500 text-xs mt-2">{errors.gstin}</p>}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-all disabled:bg-indigo-400"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </form>
        )}
      </div>
    </div>
  );
};

export default VendorApplication;
