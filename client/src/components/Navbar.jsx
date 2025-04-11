import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppcontext } from "../context/Appcontext";

const Navbar = () => {
  const {
    Student,
    seller,
    setStudent,
    setseller,
    setShowStudentLogin,
    setShowVendorLogin,
    MenuOpen,
    setMenuOpen,
  } = useAppcontext();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const navigate = useNavigate();

  const user = Student || seller;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    setStudent(null);
    setseller(null);
    setShowProfileDropdown(false);
    navigate("/");
  };

  return (
    <nav className="h-[70px] fixed top-0 left-0 w-full px-6 md:px-16 lg:px-24 xl:px-32 flex items-center justify-between z-50 bg-transparent backdrop-blur-md bg-white/50 transition-all">
      <NavLink
  to={
    Student ? "/student/dashboard" :
    seller ? "/vendor/dashboard" :
    "/"
  }
  className="flex items-center gap-2 text-black font-bold text-lg"
>
  <img className="h-9" src={assets.icon} alt="icon" />
  EveryDayMeal
</NavLink>


      {/* Desktop */}
      <div className="hidden md:flex items-center gap-4 relative">
        {!Student && !seller ? (
          <>
            <button
              onClick={() => setShowStudentLogin(true)}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-full hover:opacity-90 active:scale-95 transition"
            >
              Student Login
            </button>
            <button
              onClick={() => setShowVendorLogin(true)}
              className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-full hover:opacity-90 active:scale-95 transition"
            >
              Vendor Login
            </button>
          </>
        ) : (
          <>
            <button
              onClick={toggleProfileDropdown}
              className="text-white flex items-center gap-2 bg-indigo-600 px-3 py-1 rounded-full shadow-md hover:bg-indigo-700 transition"
            >
              <span role="img" aria-label="profile">👤</span>
              <span>{capitalize(user.name)}</span>
              <svg className={`w-4 h-4 transform transition-transform ${showProfileDropdown ? "rotate-180" : "rotate-0"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {showProfileDropdown && (
              <div className="absolute top-14 right-0 bg-white text-gray-800 shadow-lg rounded-lg p-4 w-64">
                <p className="font-semibold">{capitalize(user.name)}</p>
                <p className="text-sm text-gray-500">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-1 rounded-full text-sm transition"
                >
                  Logout
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Mobile Menu Toggle */}
      <button
        aria-label="menu-btn"
        type="button"
        className="inline-block md:hidden active:scale-90 transition"
        onClick={() => setMenuOpen(!MenuOpen)}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#fff" viewBox="0 0 30 30">
          <path d="M3 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2zm0 7a1 1 0 1 0 0 2h24a1 1 0 1 0 0-2z" />
        </svg>
      </button>

      {/* Mobile Menu Content */}
      {MenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-gradient-to-r from-indigo-700 to-violet-500 p-6 md:hidden">
          {!Student && !seller ? (
            <div className="flex flex-col gap-4">
              <button
                onClick={() => {
                  setShowStudentLogin(true);
                  setMenuOpen(false);
                }}
                className="text-sm bg-indigo-600 text-white hover:opacity-90 active:scale-95 transition w-full h-10 rounded-full"
              >
                Student Login
              </button>
              <button
                onClick={() => {
                  setShowVendorLogin(true);
                  setMenuOpen(false);
                }}
                className="text-sm bg-indigo-600 text-white hover:opacity-90 active:scale-95 transition w-full h-10 rounded-full"
              >
                Vendor Login
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <p className="text-white text-sm flex items-center gap-2 bg-indigo-600 px-3 py-1 rounded-full shadow-md">
                <span role="img" aria-label="profile">👤</span>
                <span>{capitalize(user.name)}</span>
              </p>
              <p className="text-sm text-white opacity-80">{user.email}</p>
              <button
                onClick={() => {
                  setStudent(null);
                  setseller(null);
                  setMenuOpen(false);
                  navigate("/");
                }}
                className="text-sm bg-white text-gray-700 hover:opacity-90 active:scale-95 transition w-full h-10 rounded-full"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
