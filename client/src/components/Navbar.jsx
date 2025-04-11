import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";
import { useAppcontext } from "../context/Appcontext";

const Navbar = () => {
  const {
    Student,
    seller,
    setShowStudentLogin,
    setShowVendorLogin,
    MenuOpen,
    setMenuOpen,
    logout
  } = useAppcontext();

  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  const user = Student || seller;
  const userType = Student ? "student" : seller ? "vendor" : null;

  const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

  const toggleProfileDropdown = () => {
    setShowProfileDropdown(!showProfileDropdown);
  };

  const handleLogout = () => {
    logout();
    setShowProfileDropdown(false);
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

      {/* Navigation Links */}
      <div className="hidden md:flex items-center space-x-6 mx-4">
        <NavLink 
          to="/" 
          className={({isActive}) => 
            isActive ? "font-medium text-indigo-600" : "text-gray-700 hover:text-indigo-600"
          }
        >
          Home
        </NavLink>
        <NavLink 
          to="/about" 
          className={({isActive}) => 
            isActive ? "font-medium text-indigo-600" : "text-gray-700 hover:text-indigo-600"
          }
        >
          About
        </NavLink>
        <NavLink 
          to="/contact" 
          className={({isActive}) => 
            isActive ? "font-medium text-indigo-600" : "text-gray-700 hover:text-indigo-600"
          }
        >
          Contact
        </NavLink>
      </div>

      {/* Desktop Auth */}
      <div className="hidden md:flex items-center gap-4 relative">
        {!user ? (
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
                <p className="text-sm text-indigo-600 mt-1 font-medium">
                  {userType === "student" ? "Student Account" : "Vendor Account"}
                </p>
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
        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="#000" viewBox="0 0 24 24">
          <path d="M3 6h18v2H3V6m0 5h18v2H3v-2m0 5h18v2H3v-2z" />
        </svg>
      </button>

      {/* Mobile Menu Content */}
      {MenuOpen && (
        <div className="absolute top-[70px] left-0 w-full bg-white shadow-lg p-6 md:hidden">
          {/* Mobile Navigation Links */}
          <div className="flex flex-col space-y-4 mb-6">
            <NavLink 
              to="/" 
              onClick={() => setMenuOpen(false)}
              className={({isActive}) => 
                isActive ? "font-medium text-indigo-600" : "text-gray-700"
              }
            >
              Home
            </NavLink>
            <NavLink 
              to="/about" 
              onClick={() => setMenuOpen(false)}
              className={({isActive}) => 
                isActive ? "font-medium text-indigo-600" : "text-gray-700"
              }
            >
              About
            </NavLink>
            <NavLink 
              to="/contact" 
              onClick={() => setMenuOpen(false)}
              className={({isActive}) => 
                isActive ? "font-medium text-indigo-600" : "text-gray-700"
              }
            >
              Contact
            </NavLink>
          </div>
          
          {/* Mobile Auth */}
          {!user ? (
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
              <p className="text-indigo-600 font-medium">
                {capitalize(user.name)} ({userType})
              </p>
              <p className="text-sm text-gray-500">{user.email}</p>
              <button
                onClick={() => {
                  logout();
                  setMenuOpen(false);
                }}
                className="text-sm bg-red-500 text-white hover:opacity-90 active:scale-95 transition w-full h-10 rounded-full"
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