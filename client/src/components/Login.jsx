import React, { useState, useEffect } from 'react';
import { useAppcontext } from '../context/Appcontext';
import { toast } from 'react-hot-toast';
import { studentAuth, vendorAuth } from '../services';

const Login = ({ onClose, isVendor = false }) => {
  const { setStudent, setseller, navigate } = useAppcontext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setcontactNumber] = useState("+91");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordErrors, setPasswordErrors] = useState([]);
  const [showPassword, setShowPassword] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lockoutUntil, setLockoutUntil] = useState(null);
  
  // Check if user is locked out
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
  
  // Reset login attempts after successful login
  const resetLoginAttempts = () => {
    setLoginAttempts(0);
    localStorage.removeItem('loginAttempts');
    localStorage.removeItem('loginLockout');
    setLockoutUntil(null);
  };
  
  // Check password strength
  const checkPasswordStrength = (pass) => {
    let strength = 0;
    const errors = [];
    
    // Length check
    if (pass.length < 8) {
      errors.push("Password must be at least 8 characters");
    } else {
      strength += 1;
    }
    
    // Uppercase check
    if (!/[A-Z]/.test(pass)) {
      errors.push("Password must contain at least one uppercase letter");
    } else {
      strength += 1;
    }
    
    // Lowercase check
    if (!/[a-z]/.test(pass)) {
      errors.push("Password must contain at least one lowercase letter");
    } else {
      strength += 1;
    }
    
    // Number check
    if (!/[0-9]/.test(pass)) {
      errors.push("Password must contain at least one number");
    } else {
      strength += 1;
    }
    
    setPasswordStrength(strength);
    setPasswordErrors(errors);
    return errors.length === 0;
  };


  const handleContactNumberChange = (e) => {
    let value = e.target.value;
    
    // Always start with +91
    if (!value.startsWith('+91')) {
      // If user tries to enter a number without +91, add it
      value = '+91' + value.replace(/\D/g, '');
    } else {
      // If +91 is already there, keep it and process the rest
      const prefix = '+91';
      const inputAfterPrefix = value.substring(prefix.length).replace(/\D/g, '');
      value = prefix + inputAfterPrefix;
    }
    
    // Extract only the digits after +91
    const digitsAfterCode = value.substring(3).replace(/\D/g, '');
    
    // Limit to exactly 10 digits after +91
    const limitedDigits = digitsAfterCode.substring(0, 10);
    
    // Format the number for display
    if (limitedDigits.length > 0) {
      // Create visual groups for better readability
      if (limitedDigits.length <= 5) {
        // Format: +91 XXXXX
        setcontactNumber(`+91 ${limitedDigits}`);
      } else {
        // Format: +91 XXXXX XXXXX
        const firstPart = limitedDigits.substring(0, 5);
        const secondPart = limitedDigits.substring(5);
        setcontactNumber(`+91 ${firstPart} ${secondPart}`);
      }
    } else {
      // Just the country code if no digits entered yet
      setcontactNumber('+91');
    }
  };
  
  // Function to normalize contact number before submission (remove spaces)
  const normalizeContactNumber = (number) => {
    return number.replace(/\s/g, '');
  };
  
  // Function to check if the contact number is complete (has exactly 10 digits after +91)
  const isValidContactNumber = (number) => {
    const normalized = normalizeContactNumber(number);
    return normalized.startsWith('+91') && normalized.length === 13 && /^\+91\d{10}$/.test(normalized);
  };
  
  // Validate email format
  const isValidEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };
  
  // Validate name (minimum 3 characters)
  const isValidName = (name) => {
    return name.trim().length >= 3;
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    setError("");
    
    // Check if user is locked out
    if (lockoutUntil && lockoutUntil > new Date()) {
      const timeLeft = Math.ceil((lockoutUntil - new Date()) / 1000 / 60);
      setError(`Too many failed attempts. Please try again in ${timeLeft} minutes.`);
      return;
    }
    
    // Validate inputs for registration
    if (state === "register") {
      // Name validation
      if (!isValidName(name)) {
        setError("Name must be at least 3 characters long");
        return;
      }
      
      // Email validation
      if (!isValidEmail(email)) {
        setError("Please enter a valid email address");
        return;
      }
      
      // Contact number validation
      if (!isValidContactNumber(contactNumber)) {
        setError("Please enter a valid 10-digit contact number");
        return;
      }
      
      // Password validation
      if (!checkPasswordStrength(password)) {
        setError("Please fix the password issues below");
        return;
      }
      
      // Confirm password
      if (password !== confirmPassword) {
        setError("Passwords do not match");
        return;
      }
    }
    
    setLoading(true);

    try {
      if (state === "register") {
        // Create user data object
        const userData = { name, contactNumber, email, password };
        
        // Use the appropriate auth service based on user type
        const response = isVendor 
          ? await vendorAuth.register(userData)
          : await studentAuth.register(userData);
        
        if (response.success) {
          toast.success('Account created successfully!');
          setState("login");
          setName("");
          setcontactNumber("+91");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setPasswordStrength(0);
          setPasswordErrors([]);
        } else {
          setError(response.message || "Registration failed");
        }
        return;
      }

      // Login logic
      const loginData = { email, password };
      
      // Use the appropriate auth service based on user type
      const response = isVendor 
        ? await vendorAuth.login(loginData)
        : await studentAuth.login(loginData);
      
      if (response.success) {
        // Reset login attempts on successful login
        resetLoginAttempts();
        
        // Set user state and navigate to dashboard
        if (isVendor) {
          // Store the token with the vendor data
          const vendorData = response.vendor || response.seller;
          if (response.token) {
            vendorData.token = response.token;
          }
          setseller(vendorData);
          onClose();
          navigate("/vendor/dashboard");
        } else {
          // Store the token with the student data
          const studentData = response.student;
          if (response.token) {
            studentData.token = response.token;
          }
          setStudent(studentData);
          onClose();
          navigate("/student/dashboard");
        }
        toast.success(`Welcome back!`);
      } else {
        // Increment login attempts on failure
        const newAttempts = loginAttempts + 1;
        setLoginAttempts(newAttempts);
        
        // Lock account after 5 failed attempts
        if (newAttempts >= 5) {
          const lockoutTime = Date.now() + (15 * 60 * 1000); // 15 minutes
          localStorage.setItem('loginLockout', lockoutTime.toString());
          setLockoutUntil(new Date(lockoutTime));
          setError("Too many failed attempts. Account locked for 15 minutes.");
        } else {
          setError(response.message || `Login failed. ${5 - newAttempts} attempts remaining.`);
        }
      }
    } catch (err) {
      console.error("Authentication error:", err);
      setError(err.response?.data?.message || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
          <span className="text-indigo-500">{isVendor ? "Vendor" : "Student"}</span>{" "}
          {state === "login" ? "Login" : "Sign Up"}
        </p>

        {state === "register"  && (
          <div className="w-full">
            <p>Name</p>
            <input
              onChange={(e) => setName(e.target.value)}
              value={name}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="text"
              required
            />
          </div>
        ) }

        {state === "register"  && (
          <div className="w-full">
            <p>Contact Number</p>
            <input
              onChange={(e) => setcontactNumber(e.target.value)}
              value={contactNumber}
              placeholder="Type here"
              className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
              type="text"
              required
              pattern="^\d{10}$" 
              title="Phone number should exactly contain 10 digits."
            />
          </div>
        ) }

        <div className="w-full">
          <p>Email</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="email"
            required
          />
        </div>

        <div className="w-full">
          <p>Password</p>
          <div className="relative">
            <input
              onChange={(e) => {
                setPassword(e.target.value);
                if (state === "register") {
                  checkPasswordStrength(e.target.value);
                }
              }}
              value={password}
              placeholder={state === "register" ? "Min 8 chars, 1 uppercase, 1 lowercase, 1 number" : "Type here"}
              className={`border ${state === "register" && passwordErrors.length > 0 ? 'border-red-400' : 'border-gray-200'} rounded w-full p-2 mt-1 outline-indigo-500 pr-10`}
              type={showPassword ? "text" : "password"}
              required
            />
            <button 
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-1"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                  <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                  <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-gray-500">
                  <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                  <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                  <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.5 0 2.933-.294 4.242-.827l-2.477-2.477A5.25 5.25 0 016.75 12z" />
                </svg>
              )}
            </button>
          </div>
          
          {state === "register" && (
            <div className="mt-1">
              <div className="flex space-x-1 mb-1">
                <div className={`h-1 flex-1 rounded ${passwordStrength >= 1 ? 'bg-red-400' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded ${passwordStrength >= 2 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded ${passwordStrength >= 3 ? 'bg-yellow-400' : 'bg-gray-200'}`}></div>
                <div className={`h-1 flex-1 rounded ${passwordStrength >= 4 ? 'bg-green-400' : 'bg-gray-200'}`}></div>
              </div>
              
              {passwordErrors.length > 0 && (
                <ul className="text-xs text-red-500 mt-1 pl-4">
                  {passwordErrors.map((err, index) => (
                    <li key={index} className="list-disc">{err}</li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>
        
        {state === "register" && (
          <div className="w-full">
            <p>Confirm Password</p>
            <div className="relative">
              <input
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
                placeholder="Confirm your password"
                className={`border ${confirmPassword && password !== confirmPassword ? 'border-red-400' : 'border-gray-200'} rounded w-full p-2 mt-1 outline-indigo-500`}
                type={showPassword ? "text" : "password"}
                required
              />
            </div>
            {confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-1">Passwords do not match</p>
            )}
          </div>
        )}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <p>
          {state === "register" ? "Already have an account?" : "Create an account?"}{" "}
          <span
            onClick={() => {
              setState(state === "login" ? "register" : "login");
              setError("");
            }}
            className="text-indigo-500 cursor-pointer"
          >
            Click here
          </span>
        </p>

        

        <button
          type="submit"
          disabled={loading}
          className={`${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-500 hover:bg-indigo-600'} transition-all text-white w-full py-2 rounded-md`}
        >
          {loading ? 'Processing...' : (state === "register" ? "Create Account" : "Login")}
        </button>
      </form>
    </div>
  );
};

export default Login;