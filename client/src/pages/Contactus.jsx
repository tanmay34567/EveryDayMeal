import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";
import { contactService } from "../services";

const Contact = () => {
  const [userData, setUserData] = useState({ name: "", email: "", phone: "+91", subject: "", message: "" });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    const vendor = JSON.parse(localStorage.getItem("vendor"));

    if (student) {
      setUserData((prev) => ({ 
        ...prev, 
        name: student.name, 
        email: student.email,
        phone: student.contactNumber || "+91"
      }));
    } else if (vendor) {
      setUserData((prev) => ({ 
        ...prev, 
        name: vendor.name, 
        email: vendor.email,
        phone: vendor.contactNumber || "+91"
      }));
    }
  }, []);
  
  // Validate form fields
  const validateForm = () => {
    const newErrors = {};
    
    // Name validation
    if (!userData.name.trim() || userData.name.trim().length < 3) {
      newErrors.name = "Name must be at least 3 characters";
    }
    
    // Email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userData.email.trim() || !emailRegex.test(userData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    // Phone validation
    if (userData.phone.replace("+91", "").length !== 10) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    
    // Subject validation
    if (!userData.subject.trim() || userData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters";
    }
    
    // Message validation
    if (!userData.message.trim() || userData.message.trim().length < 20) {
      newErrors.message = "Message must be at least 20 characters";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle phone number input
  const handlePhoneChange = (e) => {
    let value = e.target.value;
    
    // Ensure the user doesn't delete +91 or input anything before it
    if (!value.startsWith('+91')) {
      value = '+91' + value.replace('+91', '');
    }
    
    // Only allow digits after +91
    const digitsAfterCode = value.substring(3);
    const onlyDigits = digitsAfterCode.replace(/[^0-9]/g, '');
    
    // Format with +91 prefix and limit to 10 digits
    if (onlyDigits.length <= 10) {
      setUserData({ ...userData, phone: '+91' + onlyDigits });
    }
  };
  
  // Handle message input with character count
  const handleMessageChange = (e) => {
    const message = e.target.value;
    setUserData({ ...userData, message });
    setCharacterCount(message.length);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // First, save to localStorage as a backup
      const existingMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];
      const newMessage = {
        ...userData,
        id: Date.now().toString(),
        timestamp: new Date().toISOString()
      };
      existingMessages.push(newMessage);
      localStorage.setItem("contactMessages", JSON.stringify(existingMessages));
      
      // Then try to send to the API
      try {
        await contactService.sendMessage(userData);
        toast.success("Your message has been sent successfully!");
      } catch (error) {
        console.error("Failed to send message to API:", error);
        toast.success("Your message has been saved locally. We'll process it when connection is restored.");
      }
      
      // Show success and reset form
      setSubmitted(true);
      setUserData({ name: "", email: "", phone: "+91", subject: "", message: "" });
      setCharacterCount(0);
      
      // Reset submitted state after 5 seconds
      setTimeout(() => {
        setSubmitted(false);
      }, 5000);
    } catch (error) {
      console.error("Error saving message:", error);
      toast.error("There was a problem sending your message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
          {/* Fixed Background Image */}
          <img
            src={assets.bg}
            alt="bg"
            className="fixed top-0 left-0 w-full h-screen object-cover z-[-1] bg-animation"
          />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 h-[500px] overflow-y-auto bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">Contact Us</h1>
      <p className="text-gray-700 text-lg mb-4">
        Have questions, suggestions, or just want to say hi?
      </p>
      <p className="text-gray-600 mb-6">
        We'd love to hear from you. Reach out using the form below or connect with us directly through email.
      </p>

      {submitted ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">
                Thank you for your message! We'll get back to you as soon as possible.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={userData.name}
              onChange={(e) => setUserData({ ...userData, name: e.target.value })}
              className={`mt-1 block w-full border ${errors.name ? 'border-red-300' : 'border-gray-300'} rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Your name (min 3 characters)"
              disabled={loading}
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={userData.email}
              onChange={(e) => setUserData({ ...userData, email: e.target.value })}
              className={`mt-1 block w-full border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Your email address"
              disabled={loading}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Phone Number</label>
            <input
              type="text"
              value={userData.phone}
              onChange={handlePhoneChange}
              className={`mt-1 block w-full border ${errors.phone ? 'border-red-300' : 'border-gray-300'} rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Your phone number"
              disabled={loading}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Subject</label>
            <input
              type="text"
              value={userData.subject}
              onChange={(e) => setUserData({ ...userData, subject: e.target.value })}
              className={`mt-1 block w-full border ${errors.subject ? 'border-red-300' : 'border-gray-300'} rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Subject of your message"
              disabled={loading}
            />
            {errors.subject && <p className="text-red-500 text-xs mt-1">{errors.subject}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Message 
              <span className={`text-xs ml-2 ${characterCount < 20 ? 'text-red-500' : characterCount > 500 ? 'text-orange-500' : 'text-green-500'}`}>
                {characterCount}/1000 characters
              </span>
            </label>
            <textarea
              rows="4"
              value={userData.message}
              onChange={handleMessageChange}
              className={`mt-1 block w-full border ${errors.message ? 'border-red-300' : 'border-gray-300'} rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500`}
              placeholder="Your message (min 20 characters)"
              maxLength="1000"
              disabled={loading}
            ></textarea>
            {errors.message && <p className="text-red-500 text-xs mt-1">{errors.message}</p>}
          </div>
          
          <div className="flex items-center">
            <input
              id="privacy-policy"
              name="privacy-policy"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              required
            />
            <label htmlFor="privacy-policy" className="ml-2 block text-sm text-gray-900">
              I agree to the <span className="text-indigo-600">privacy policy</span> and consent to being contacted
            </label>
          </div>
          
          <button
            type="submit"
            className={`${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white px-6 py-2 rounded-md transition flex items-center justify-center`}
            disabled={loading}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      )}
    </div>
    </div>
    
  );
};

export default Contact;
