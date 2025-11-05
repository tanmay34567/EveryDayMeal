import React, { useState, useEffect } from 'react';
import { useAppcontext } from '../context/Appcontext';
import { toast } from 'react-hot-toast';
import { vendorAuth } from '../services';
import axios from 'axios';

const VendorLogin = ({ onClose }) => {
  const { setseller, navigate } = useAppcontext();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const [checkingStatus, setCheckingStatus] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState(null);

  const handleApplyNow = () => {
    onClose();
    navigate('/vendor/apply');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // Check application status when email is entered
  const checkApplicationStatus = async (email) => {
    if (!validateEmail(email)) return;
    
    try {
      setCheckingStatus(true);
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/vendor/status/${email}`);
      
      if (response.data.success && response.data.hasApplication) {
        setApplicationStatus(response.data.application);
      } else {
        setApplicationStatus(null);
      }
    } catch (error) {
      if (error.response?.status !== 404) {
        console.error('Error checking application status:', error);
      }
      setApplicationStatus(null);
    } finally {
      setCheckingStatus(false);
    }
  };

  // Debounce email check
  useEffect(() => {
    if (email && validateEmail(email)) {
      const timer = setTimeout(() => {
        checkApplicationStatus(email);
      }, 500);
      return () => clearTimeout(timer);
    } else {
      setApplicationStatus(null);
    }
  }, [email]);

  const handleSendOtp = async () => {
    if (!validateEmail(email)) {
      setError('Please enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await vendorAuth.sendOtp({ email });
      if (response.success) {
        toast.success('OTP sent to your email.');
        setIsOtpSent(true);
        setResendTimer(30);
      } else {
        setError(response.message || 'Failed to send OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp || otp.length !== 6) {
      setError('Please enter the 6-digit OTP.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await vendorAuth.verifyOtp({ email, otp });
      if (response.success) {
        // Check if this is admin login
        if (response.isAdmin) {
          const adminData = {
            ...(response.user || {}),
            email: response.user?.email || email,
            token: response.token,
            isAdmin: true
          };
          
          // Validate token exists before storing
          if (!adminData.token) {
            setError('Authentication token missing. Please try again.');
            return;
          }
          
          // Store admin data
          setseller(adminData);
          toast.success('Admin login successful!');
          onClose();
          navigate('/admin/dashboard');
          return;
        }

        // Regular vendor login
        const vendorData = {
          ...(response.vendor || {}),
          email: response.vendor?.email || email,
          token: response.token || response.vendor?.token,
          isAdmin: false
        };
        
        // Validate token exists before storing
        if (!vendorData.token) {
          setError('Authentication token missing. Please try again.');
          return;
        }
        
        // Store vendor data with token
        setseller(vendorData);
        toast.success('Login successful!');
        onClose();
        navigate('/vendor/dashboard');
      } else {
        setError(response.message || 'Invalid OTP.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    if (isOtpSent) {
      handleVerifyOtp();
    } else {
      handleSendOtp();
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendTimer]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={onSubmitHandler}
        className="relative flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white text-sm text-gray-600"
      >
        <button type="button" onClick={onClose} className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl">&times;</button>
        <p className="text-2xl font-medium text-center w-full"><span className="text-green-600">Vendor</span> Login</p>
        
        <div className="w-full">
          <p>Email</p>
          <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter your registered email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500 text-black" type="email" required disabled={isOtpSent} />
          
          {/* Application Status Display */}
          {checkingStatus && (
            <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-lg flex items-center gap-2">
              <div className="h-3 w-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <span className="text-xs text-blue-700">Checking status...</span>
            </div>
          )}
          
          {applicationStatus && (
            <div className={`mt-2 p-3 rounded-lg border ${
              applicationStatus.status === 'pending' 
                ? 'bg-yellow-50 border-yellow-300' 
                : applicationStatus.status === 'approved'
                ? 'bg-green-50 border-green-300'
                : 'bg-red-50 border-red-300'
            }`}>
              <div className="flex items-start gap-2">
                <div className="text-lg">
                  {applicationStatus.status === 'pending' && '⏳'}
                  {applicationStatus.status === 'approved' && '✅'}
                  {applicationStatus.status === 'rejected' && '❌'}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold text-xs mb-1 ${
                    applicationStatus.status === 'pending' 
                      ? 'text-yellow-800' 
                      : applicationStatus.status === 'approved'
                      ? 'text-green-800'
                      : 'text-red-800'
                  }`}>
                    {applicationStatus.status === 'pending' && 'Application Under Review'}
                    {applicationStatus.status === 'approved' && 'Application Approved'}
                    {applicationStatus.status === 'rejected' && 'Application Rejected'}
                  </h3>
                  <p className={`text-xs ${
                    applicationStatus.status === 'pending' 
                      ? 'text-yellow-700' 
                      : applicationStatus.status === 'approved'
                      ? 'text-green-700'
                      : 'text-red-700'
                  }`}>
                    {applicationStatus.status === 'pending' && 
                      `Your application for "${applicationStatus.messName}" is being reviewed.`
                    }
                    {applicationStatus.status === 'approved' && 
                      `You can now log in to manage "${applicationStatus.messName}".`
                    }
                    {applicationStatus.status === 'rejected' && 
                      'Your application was not approved. Contact support for details.'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {isOtpSent && (
          <div className="w-full">
            <p>Enter OTP</p>
            <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="6-digit OTP" className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500 text-black" type="text" maxLength="6" required />
            <div className="flex justify-end mt-2 text-xs">
              <button type="button" disabled={resendTimer > 0 || loading} onClick={handleSendOtp} className={`${resendTimer > 0 ? 'text-gray-400' : 'text-green-600'} hover:opacity-90`}>
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button type="submit" disabled={loading} className={`${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} transition-all text-white w-full py-2 rounded-md`}>
          {loading ? 'Processing...' : (isOtpSent ? 'Verify OTP' : 'Send OTP')}
        </button>

        <p className="text-center">
          Not a registered vendor?{" "}
          <span onClick={handleApplyNow} className="text-green-600 cursor-pointer hover:underline">
            Apply Now
          </span>
        </p>
      </form>
    </div>
  );
};

export default VendorLogin;
