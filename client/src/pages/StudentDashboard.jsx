import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";

const capitalize = (str) =>
  str
    ?.split(" ")
    .map((w) => w[0].toUpperCase() + w.slice(1).toLowerCase())
    .join(" ") || "";

const StudentDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const allVendors = JSON.parse(localStorage.getItem("vendors")) || [];
    const filtered = allVendors.filter((v) => v.menuSaved); // only vendors who saved menus
    setVendors(filtered);
  }, []);

  const goToMenu = (vendorEmail) => {
    navigate(`/student/menu/${encodeURIComponent(vendorEmail)}`);
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
          {/* Fixed Background Image */}
          <img
            src={assets.bg}
            alt="Background"
            className="fixed top-0 left-0 w-full h-full object-cover z-[-1] animate-slow-spin"
          />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Student Dashboard</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Vendors:</h2>

        {vendors.length === 0 ? (
          <p className="text-gray-500 text-center">No vendors have uploaded menus yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {vendors.map((vendor) => (
              <button
                key={vendor.email}
                onClick={() => goToMenu(vendor.email)}
                className="bg-indigo-100 text-indigo-800 font-medium py-3 px-4 rounded-lg shadow hover:bg-indigo-200 transition-all"
              >
                {capitalize(vendor.name)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
   
  );
};

export default StudentDashboard;
