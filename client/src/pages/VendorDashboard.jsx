import React, { useState } from "react";

const VendorDashboard = () => {
  const [menu, setMenu] = useState({
    breakfast: "Poha, Tea/Coffee, Bread Butter, Boiled Eggs",
    lunch: "Rice, Dal Tadka, Roti, Paneer Butter Masala, Salad, Curd",
    snacks: "Samosa, Chai, Pakoras",
    dinner: "Jeera Rice, Rajma, Chapati, Mixed Veg, Sweet Dish",
  });

  const handleMenuChange = (meal, value) => {
    setMenu((prevMenu) => ({
      ...prevMenu,
      [meal]: value,
    }));
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center">Vendor Dashboard</h1>
      <p className="mt-2 text-gray-600 text-center">
        Welcome to your dashboard, Vendor!
      </p>

      {/* Mess Timings */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Mess Timings</h2>
        <ul className="mt-2 text-gray-700">
          <li>Breakfast: 7:00 AM - 9:30 AM</li>
          <li>Lunch: 12:00 PM - 2:30 PM</li>
          <li>Snacks: 4:00 PM - 6:00 PM</li>
          <li>Dinner: 7:30 PM - 10:00 PM</li>
        </ul>
      </div>

      {/* Menu Section */}
      <div className="mt-6 bg-white p-4 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold">Today's Menu</h2>
        <div className="mt-2 text-gray-700">
          {Object.keys(menu).map((meal) => (
            <div key={meal} className="mb-4">
              <label className="block font-semibold capitalize">{meal}:</label>
              <input
                type="text"
                value={menu[meal]}
                onChange={(e) => handleMenuChange(meal, e.target.value)}
                className="mt-1 p-2 border rounded w-full"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;