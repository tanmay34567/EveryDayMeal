import React, { useState, useEffect } from 'react';
import { useAppcontext } from '../context/Appcontext';
import { toast } from 'react-hot-toast';
import { vendorAuth } from '../services';

const VendorLogin = ({ onClose }) => {
  const { setseller, navigate } = useAppcontext();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const handleApplyNow = () => {
    onClose();
    navigate('/vendor/apply');
  };

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

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
          <input onChange={(e) => setEmail(e.target.value)} value={email} placeholder="Enter your registered email" className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500" type="email" required disabled={isOtpSent} />
        </div>

        {isOtpSent && (
          <div className="w-full">
            <p>Enter OTP</p>
            <input onChange={(e) => setOtp(e.target.value)} value={otp} placeholder="6-digit OTP" className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500" type="text" maxLength="6" required />
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
