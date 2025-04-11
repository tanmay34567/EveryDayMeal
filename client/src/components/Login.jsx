import React, { useState } from 'react';
import { useAppcontext } from '../context/Appcontext';
import { useNavigate } from "react-router-dom";

const Login = ({ onClose, isVendor = false }) => {
  const { setStudent, setseller } = useAppcontext();
  const [state, setState] = useState("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate(); // ✅

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

  const onSubmitHandler = (event) => {
    event.preventDefault();
    setError("");

    if (state === "register") {
      if (findAccount(email)) {
        setError("Account already exists with this email.");
        return;
      }

      const newAccount = { name, email, password };
      saveAccount(newAccount);

      setState("login");
      setName("");
      setEmail("");
      setPassword("");
      setError("Account created! Please login.");
      return;
    }

    const account = findAccount(email, password);
    if (!account) {
      setError("Invalid credentials or account does not exist.");
      return;
    }

    // ✅ Set context and redirect to the appropriate dashboard
    if (isVendor) {
      setseller(account);
      navigate("/vendor/dashboard");
    } else {
      setStudent(account);
      navigate("/student/dashboard");
    }

    onClose();
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

        {state === "register" && (
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
        )}

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
