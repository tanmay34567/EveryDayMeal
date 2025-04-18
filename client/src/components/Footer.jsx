import React from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { useAppcontext } from "../context/Appcontext";

const Footer = () => {
  const { Student, seller } = useAppcontext();

  // Function to scroll to the top of the page
  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Ensures smooth scroll to the top
    });
  };

  return (
    <footer className="relative w-full px-6 md:px-16 lg:px-24 xl:px-32 pt-10 backdrop-blur-md bg-white/50 shadow-inner transition-all">
      <div className="flex flex-col md:flex-row justify-between w-full gap-10 border-b border-black/20 pb-6">
        <div className="md:max-w-md">
          <div className="flex items-center gap-2">
            <img className="h-9" src={assets.icon} alt="EveryDayMeal Logo" />
          </div>
          <p className="mt-6 text-sm text-black-600">
            EveryDayMeal helps students discover daily mess menus within 2 km of campus. 
            Get real-time updates, community reviews, and smart dining suggestions — all in one place.
          </p>
        </div>

        <div className="flex-1 flex flex-col sm:flex-row items-start md:justify-end gap-10">
          <div>
            <h2 className="font-semibold mb-4 text-black-900">Company</h2>
            <ul className="text-sm space-y-2 text-black-700">
              <li>
                <Link
                  to={Student ? "/student/dashboard" : seller ? "/vendor/dashboard" : "/"}
                  onClick={handleScrollToTop}  // Scroll to top when clicked
                >
                  Home
                </Link>
              </li>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact Us</Link></li>
            </ul>
          </div>

          <div>
            <h2 className="font-semibold mb-4 text-black-900">Get in Touch</h2>
            <div className="text-sm space-y-2 text-black-700">
              <p>+91-8080065293</p>
              <p>everydaymeal@gmail.com</p>
            </div>
          </div>
        </div>
      </div>

      <p className="pt-6 text-center text-xs md:text-sm text-black-600 pb-6">
        © {new Date().getFullYear()} EveryDayMeal. All Rights Reserved.
      </p>
    </footer>
  );
};

export default Footer;
