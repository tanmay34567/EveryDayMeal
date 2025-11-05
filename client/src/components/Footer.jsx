import React from "react";
import { assets } from "../assets/assets";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAppcontext } from "../context/Appcontext";

const Footer = () => {
  const { Student, seller } = useAppcontext();
  const navigate = useNavigate();
  const location = useLocation();

  // Function to scroll to the top of the page
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Ensures smooth scroll to the top
    });
  };
  
  // Handle navigation with smooth scrolling
  const handleNavigation = (path, e) => {
    e.preventDefault();
    
    // If we're already on the same page, just scroll to top
    if (location.pathname === path) {
      handleScrollToTop();
      return;
    }
    
    // Navigate to the page and then scroll to top
    navigate(path);
  };

  return (
    <footer className="relative w-full px-4 sm:px-6 md:px-16 lg:px-24 xl:px-32 pt-6 sm:pt-10 bg-green-50 border-t border-green-200 shadow-sm transition-all">
      <div className="flex flex-col md:flex-row justify-between w-full gap-6 sm:gap-10 border-b border-green-200 pb-4 sm:pb-6">
        <div className="md:max-w-md">
          <div className="flex items-center gap-2">
            <img className="h-7 sm:h-9" src={assets.icon} alt="EveryDayMeal Logo" />
            <span className="text-lg sm:text-xl font-bold text-green-600">EveryDayMeal</span>
          </div>
          <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
            EveryDayMeal helps students discover daily mess menus within 2 km of campus. 
            Get real-time updates, community reviews, and smart dining suggestions — all in one place.
          </p>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-6 sm:gap-10">
          <div>
            <h2 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base text-gray-900">Company</h2>
            <ul className="text-xs sm:text-sm space-y-1.5 sm:space-y-2 text-gray-600">
              <li>
                <Link
                  to={Student ? "/student/dashboard" : seller ? "/vendor/dashboard" : "/"}
                  onClick={handleScrollToTop}  // Scroll to top when clicked
                  className="hover:text-green-600 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/about" 
                  onClick={(e) => handleNavigation('/about', e)}
                  className="hover:text-green-600 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  onClick={(e) => handleNavigation('/contact', e)}
                  className="hover:text-green-600 transition-colors"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-2 sm:mb-4 text-sm sm:text-base text-gray-900">Get in Touch</h2>
            <div className="text-xs sm:text-sm space-y-1.5 sm:space-y-2 text-gray-600">
              <p>+91-8080065293</p>
              <p>everydaymeal80@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-4 sm:pt-6 text-center text-xs sm:text-sm text-gray-500 pb-4 sm:pb-6">
        © {new Date().getFullYear()} EveryDayMeal. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
