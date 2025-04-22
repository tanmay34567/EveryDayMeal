import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { assets } from "../assets/assets";

const capitalize = (str = "") =>
    str
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
      .join(" ");

const StudentVendorMenu = () => {
  const { vendorEmail } = useParams();
  const [menu, setMenu] = useState(null);
  const [vendorName, setVendorName] = useState("");

  useEffect(() => {
    const vendors = JSON.parse(localStorage.getItem("vendors")) || [];
    const vendor = vendors.find((v) => v.email === vendorEmail);
    if (vendor) setVendorName(vendor.name);

    const vendorMenu = JSON.parse(localStorage.getItem(`vendorMenu_${vendorEmail}`));
    setMenu(vendorMenu);
  }, [vendorEmail]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
              {/* Fixed Background Image */}
              <img
                src={assets.bg}
                alt="Background"
                className="fixed top-0 left-0 w-full h-full object-cover z-[-1] animate-slow-spin"
              />
    
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-indigo-700 text-center mb-6">
        {capitalize(vendorName) } (Menu)
      </h1>

        {!menu ? (
          <p className="text-center text-gray-500">No menu found for this vendor.</p>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-600 font-bold text-xl">Day: {menu.day}</p>
              <p className="text-gray-600 font-bold text-md">Date: {menu.date}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(menu.meals).map(([meal, data]) => (
                <div
                  key={meal}
                  className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm"
                >
                  <h3 className="text-xl font-bold capitalize text-indigo-600 mb-2">{meal}</h3>
                  <p className="text-gray-700"><strong>Items:</strong> {data.items}</p>
                  <p className="text-gray-700"><strong>Start:</strong> {data.startTime}</p>
                  <p className="text-gray-700"><strong>End:</strong> {data.endTime}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentVendorMenu;
