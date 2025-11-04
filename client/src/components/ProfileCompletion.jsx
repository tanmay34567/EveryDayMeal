import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { studentAuth } from '../services';
import { useAppcontext } from '../context/Appcontext';

const ProfileCompletion = () => {
  const { setStudent, Student } = useAppcontext();
  const [formData, setFormData] = useState({
    name: '',
    contactNumber: '+91',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  // Redirect to dashboard if profile is already complete
  React.useEffect(() => {
    if (Student) {
      const hasValidName = Student.name && Student.name !== 'New User' && Student.name.trim() !== '';
      const hasValidContact = Student.contactNumber && !Student.contactNumber.startsWith('TEMP-');
      
      if (hasValidName && hasValidContact) {
        console.log('Profile already complete, redirecting to dashboard');
        navigate('/student/dashboard', { replace: true });
      }
    }
  }, [Student, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number input
    if (name === 'contactNumber') {
      // Only allow numbers and limit to 10 digits after +91
      const numbers = value.replace(/\D/g, '');
      const formattedValue = numbers.startsWith('91') ? 
        `+${numbers.substring(0, 12)}` : 
        `+91${numbers.substring(0, 10)}`;
      
      setFormData(prev => ({
        ...prev,
        [name]: formattedValue
      }));
      
      // Clear error when user starts typing
      if (errors.contactNumber) {
        setErrors(prev => ({ ...prev, contactNumber: '' }));
      }
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }
    
    const phoneRegex = /^\+91\d{10}$/;
    if (!formData.contactNumber) {
      newErrors.contactNumber = 'Phone number is required';
    } else if (!phoneRegex.test(formData.contactNumber)) {
      newErrors.contactNumber = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      console.log('Form validation failed', errors);
      return;
    }
    
    setLoading(true);
    
    // Remove +91 prefix before sending to server (server expects only 10 digits)
    const contactNumberWithoutPrefix = formData.contactNumber.replace('+91', '');
    
    console.log('Updating profile with data:', {
      name: formData.name.trim(),
      contactNumber: contactNumberWithoutPrefix
    });
    
    try {
      const response = await studentAuth.updateProfile({
        name: formData.name.trim(),
        contactNumber: contactNumberWithoutPrefix
      });
      
      console.log('Profile update response:', response);
      
      if (response.success) {
        toast.success('Profile updated successfully!');
        // Use the student returned by the updateProfile response
        if (response.student) {
          setStudent({ ...response.student });
        }
        navigate('/student/dashboard');
      } else {
        console.error('Profile update failed:', response.message);
        toast.error(response.message || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      // If server signals duplicate phone number
      if (error?.response?.status === 409) {
        const msg = error.response.data?.message || 'This phone number is already registered. Please use a different number.';
        setErrors(prev => ({ ...prev, contactNumber: msg }));
        toast.error(msg);
      } else {
        toast.error('An error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Complete Your Profile
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Please provide your details to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <div className="mt-1">
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-black placeholder-gray-500"
                  placeholder="John Doe"
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            </div>

            <div>
              <label htmlFor="contactNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <div className="mt-1">
                <input
                  id="contactNumber"
                  name="contactNumber"
                  type="tel"
                  autoComplete="tel"
                  required
                  value={formData.contactNumber}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-gray-50 text-black placeholder-gray-500"
                  placeholder="+91XXXXXXXXXX"
                />
                {errors.contactNumber && (
                  <p className="mt-2 text-sm text-red-600">{errors.contactNumber}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Saving...' : 'Continue to Dashboard'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileCompletion;
