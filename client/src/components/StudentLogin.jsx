import React, { useState, useEffect } from 'react';
import { useAppcontext } from '../context/Appcontext';
import { toast } from 'react-hot-toast';
import { studentAuth } from '../services';

const StudentLogin = ({ onClose }) => {
  const { setStudent, navigate } = useAppcontext();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendTimer, setResendTimer] = useState(0);

  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    const storedLockout = localStorage.getItem('loginLockout');
    if (storedLockout) {
      const lockoutTime = parseInt(storedLockout);
      if (lockoutTime > Date.now()) {
        setLockoutUntil(new Date(lockoutTime));
      } else {
        localStorage.removeItem('loginLockout');
      }
    }
  }, []);

  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('loginLockout');
    setLockoutUntil(null);
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    if (error) setError('');
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");

    if (lockoutUntil && lockoutUntil > new Date()) {
      const remainingMinutes = Math.ceil((lockoutUntil - new Date()) / (60 * 1000));
      setError(`Account locked due to too many failed attempts. Try again in ${remainingMinutes} minutes.`);
      return;
    }

    if (!validateEmail(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (isOtpSent && (!otp || otp.length !== 6)) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    setLoading(true);

    try {
      if (!isOtpSent) {
        const resp = await studentAuth.sendEmailOtp(email);
        if (resp.success) {
          setIsOtpSent(true);
          setResendTimer(30);
          setError('');
          toast.success('OTP sent to your email');
        } else {
          setError(resp.message || 'Failed to send OTP');
        }
        setLoading(false);
        return;
      }

      const resp = await studentAuth.verifyEmailOtp(email, otp);
      if (resp.success) {
        resetLoginAttempts();
        const studentData = resp.student || {};
        if (!resp.token && studentData.token) {
          resp.token = studentData.token;
        }
        setStudent({
          ...studentData,
          token: resp.token || studentData.token
        });
        onClose();
        if (resp.userCheck) {
          if (resp.userCheck.isNewUser || !resp.userCheck.hasName || !resp.userCheck.hasContact) {
            navigate("/student/complete-profile");
            toast.success('Please complete your profile');
          } else {
            navigate("/student/dashboard");
            toast.success('Welcome back!');
          }
        } else {
          const isProfileComplete = studentData.name && studentData.contactNumber && studentData.name.trim() !== '' && studentData.contactNumber.trim() !== '';
          if (isProfileComplete) {
            navigate("/student/dashboard");
            toast.success('Welcome back!');
          } else {
            navigate("/student/complete-profile");
            toast.success('Please complete your profile');
          }
        }
      } else {
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        if (newAttempts >= 5) {
          const lockoutTime = Date.now() + (15 * 60 * 1000);
          localStorage.setItem('loginLockout', lockoutTime.toString());
          setLockoutUntil(new Date(lockoutTime));
          setError("Too many failed attempts. Account locked for 15 minutes.");
        } else {
          setError(resp.message || `Login failed. ${5 - newAttempts} attempts remaining.`);
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (resendTimer > 0) {
      const t = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [resendTimer]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-50 flex items-center justify-center bg-black/50">
      <form
        onSubmit={onSubmitHandler}
        className="relative flex flex-col gap-4 p-8 py-12 w-80 sm:w-[352px] rounded-lg shadow-xl border border-gray-200 bg-white text-sm text-gray-600"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-800 text-xl"
        >
          &times;
        </button>

        <p className="text-2xl font-medium text-center w-full">
          <span className="text-green-600">Student</span> Login
        </p>

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={handleEmailChange}
            value={email}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500"
            type="email"
            required
          />
        </div>

        {isOtpSent && (
          <div className="w-full">
            <p>Enter OTP</p>
            <input
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              value={otp}
              placeholder="6-digit OTP"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-green-500"
              type="tel"
              maxLength="6"
              required
            />
            <div className="flex justify-end mt-2 text-xs">
              <button
                type="button"
                disabled={resendTimer > 0 || loading}
                onClick={async () => {
                  try {
                    setLoading(true);
                    const resp = await studentAuth.sendEmailOtp(email);
                    if (resp.success) {
                      setResendTimer(30);
                      toast.success('OTP resent');
                    } else {
                      setError(resp.message || 'Failed to resend OTP');
                    }
                  } catch (e) {
                    setError('Failed to resend OTP');
                  } finally {
                    setLoading(false);
                  }
                }}
                className={`${resendTimer > 0 ? 'text-gray-400' : 'text-green-600'} hover:opacity-90`}
              >
                {resendTimer > 0 ? `Resend in ${resendTimer}s` : 'Resend OTP'}
              </button>
            </div>
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className={`${loading ? 'bg-green-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'} transition-all text-white w-full py-2 rounded-md`}
        >
          {loading
            ? 'Processing...'
            : !isOtpSent ? 'Send OTP' : 'Verify OTP'}
        </button>
      </form>
    </div>
  );
};

export default StudentLogin;
