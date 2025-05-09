import React, { useState } from 'react';
import { useAppcontext } from '../context/Appcontext';

const Login = ({ onClose, isVendor = false }) => {
  const { setStudent, setseller, navigate } = useAppcontext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [contactNumber, setcontactNumber] = useState("")
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const getStorageKey = () => isVendor ? "vendors" : "students";

  const getStoredAccounts = () => {
    const data = localStorage.getItem(getStorageKey());
    return data ? JSON.parse(data) : [];
  };

  const saveAccount = (account) => {
    const accounts = getStoredAccounts();
    accounts.push(account);
    localStorage.setItem(getStorageKey(), JSON.stringify(accounts));
  };

  const findAccount = (email, password = null) => {
    const accounts = getStoredAccounts();
    return accounts.find(acc => acc.email === email && (!password || acc.password === password));
  };

  const handleContactNumberChange = (e) => {
    let value = e.target.value;

    // Ensure the user doesn't delete +91 or input anything before it
    if (!value.startsWith('+91')) {
      value = '+91' + value.replace('+91', ''); // Prepend +91 if not already present
    }

    // Only allow up to 10 digits after +91
    if (value.length <= 13) {
      setContactNumber(value);
    }
  };

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setError("");

    if (state === "register") {
      if (findAccount(email)) {
        setError("Account already exists with this email.");
        return;
      }

      const newAccount = { name, contactNumber,email, password };
      saveAccount(newAccount);

      setState("login");
      setName("");
      setcontactNumber("")
      setEmail("");
      setPassword("");
      setError("Account created! Please login.");
      return;
    }

    const account = findAccount(email, password);
    if (!account) {
      setError("Invalid credentials or account doesn't exist.");
      return;
    }

    // Set user state and navigate to dashboard
    if (isVendor) {
      setseller(account);
      // Close modal before navigation
      onClose();
      navigate("/vendor/dashboard");
    } else {
      setStudent(account);
      // Close modal before navigation
      onClose();
      navigate("/student/dashboard");
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
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="Type here"
            className="border border-gray-200 rounded w-full p-2 mt-1 outline-indigo-500"
            type="password"
            required
          />
        </div>

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
          className="bg-indigo-500 hover:bg-indigo-600 transition-all text-white w-full py-2 rounded-md"
        >
          {state === "register" ? "Create Account" : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;