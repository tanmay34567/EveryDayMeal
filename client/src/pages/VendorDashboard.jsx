import React, { useState, useEffect, useRef } from "react";
import { useAppcontext } from "../context/Appcontext";

const capitalize = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const VendorDashboard = () => {
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [savedMenu, setSavedMenu] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [menuData, setMenuData] = useState({
    breakfast: { items: "", startTime: "", startPeriod: "AM", endTime: "", endPeriod: "AM" },
    lunch: { items: "", startTime: "", startPeriod: "PM", endTime: "", endPeriod: "PM" },
    dinner: { items: "", startTime: "", startPeriod: "PM", endTime: "", endPeriod: "PM" },
  });

  const { seller } = useAppcontext();
  const formRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem(`vendorMenu_${seller.email}`);
    if (saved) {
      setSavedMenu(JSON.parse(saved));
    }
  }, [seller.email]);

  const isDateAndDayMatching = () => {
    if (!date || !day) return false;

    const selectedDate = new Date(date);
    const selectedDayIndex = selectedDate.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const actualDay = daysOfWeek[selectedDayIndex];

    return actualDay === day;
  };

  const handleChange = (meal, field, value) => {
    setMenuData((prev) => ({
      ...prev,
      [meal]: {
        ...prev[meal],
        [field]: value,
      },
    }));
  };

  const formatTime = (time, period) => {
    return time ? `${time} ${period}` : "";
  };

  const handleSubmit = () => {
    if (!date || !day) {
      alert("Please enter date and day.");
      return;
    }

    if (!isDateAndDayMatching()) {
      alert("Selected day and date do not match. Please correct them.");
      return;
    }

    const formattedData = {
      date,
      day,
      meals: {},
    };

    for (const meal in menuData) {
      formattedData.meals[meal] = {
        items: menuData[meal].items,
        startTime: formatTime(menuData[meal].startTime, menuData[meal].startPeriod),
        endTime: formatTime(menuData[meal].endTime, menuData[meal].endPeriod),
      };
    }

    localStorage.setItem(`vendorMenu_${seller.email}`, JSON.stringify(formattedData));
    setSavedMenu(formattedData);
    setIsEditing(false);

    const vendors = JSON.parse(localStorage.getItem("vendors")) || [];
    const updatedVendors = vendors.map(v =>
      v.email === seller.email ? { ...v, menuSaved: true } : v
    );
    localStorage.setItem("vendors", JSON.stringify(updatedVendors));

    alert("Menu saved successfully!");
  };

  const handleDelete = () => {
    localStorage.removeItem(`vendorMenu_${seller.email}`);
    setSavedMenu(null);
    setIsEditing(false);

    const vendors = JSON.parse(localStorage.getItem("vendors")) || [];
    const updatedVendors = vendors.map(v =>
      v.email === seller.email ? { ...v, menuSaved: false } : v
    );
    localStorage.setItem("vendors", JSON.stringify(updatedVendors));

    alert("Menu deleted.");
  };

  const handleEdit = () => {
    if (!savedMenu) return;

    setDate(savedMenu.date);
    setDay(savedMenu.day);

    const menuCopy = {};
    for (const meal in savedMenu.meals) {
      const { items, startTime, endTime } = savedMenu.meals[meal];
      const [startT, startP] = startTime.split(" ");
      const [endT, endP] = endTime.split(" ");

      menuCopy[meal] = {
        items,
        startTime: startT || "",
        startPeriod: startP || (meal === "breakfast" ? "AM" : "PM"),
        endTime: endT || "",
        endPeriod: endP || (meal === "breakfast" ? "AM" : "PM"),
      };
    }

    setMenuData(menuCopy);
    setIsEditing(true);

    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResetMeal = (meal) => {
    setMenuData((prev) => ({
      ...prev,
      [meal]: {
        items: "",
        startTime: "",
        startPeriod: meal === "breakfast" ? "AM" : "PM",
        endTime: "",
        endPeriod: meal === "breakfast" ? "AM" : "PM",
      },
    }));
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-6">
      <div ref={formRef} className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          <span>{capitalize(seller?.name) || "Vendor"}</span> Dashboard
        </h1>

        {/* Date & Day */}
        <div className="mb-6">
          <label className="block font-semibold text-lg mb-1 text-gray-700">Select Day</label>
          <select
            value={day}
            onChange={(e) => setDay(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300 shadow-sm"
          >
            <option value="">Day</option>
            {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        <div className="mb-6">
          <label className="block font-semibold text-lg mb-1 text-gray-700">Select Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 rounded-lg border border-gray-300"
          />
        </div>

        {/* Menu Input */}
        {Object.keys(menuData).map((meal) => (
          <div key={meal} className="mb-8 bg-gray-50 border border-gray-200 p-5 rounded-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold capitalize text-indigo-600">{meal}</h2>
              {isEditing && (
                <button
                  onClick={() => handleResetMeal(meal)}
                  className="text-sm text-red-600 font-medium hover:underline"
                >
                  Reset {meal}
                </button>
              )}
            </div>

            <label className="block font-medium mb-1 text-gray-700">Menu Items</label>
            <input
              type="text"
              value={menuData[meal].items}
              onChange={(e) => handleChange(meal, "items", e.target.value)}
              placeholder={`Enter ${meal} menu...`}
              className="mb-4 w-full p-3 rounded-lg border border-gray-300"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Start Time */}
              <div>
                <label className="block font-medium mb-1 text-gray-700">Start Time</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={menuData[meal].startTime}
                    onChange={(e) => handleChange(meal, "startTime", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300"
                  />
                  <select
                    value={menuData[meal].startPeriod}
                    onChange={(e) => handleChange(meal, "startPeriod", e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>

              {/* End Time */}
              <div>
                <label className="block font-medium mb-1 text-gray-700">End Time</label>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={menuData[meal].endTime}
                    onChange={(e) => handleChange(meal, "endTime", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300"
                  />
                  <select
                    value={menuData[meal].endPeriod}
                    onChange={(e) => handleChange(meal, "endPeriod", e.target.value)}
                    className="p-3 border border-gray-300 rounded-lg"
                  >
                    <option>AM</option>
                    <option>PM</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        ))}

        <button
          onClick={handleSubmit}
          className="mt-6 w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-semibold py-3 rounded-xl"
        >
          {isEditing ? "Update Menu" : "Save Menu & Timings"}
        </button>

        {/* Show Saved Menu */}
        {savedMenu && (
          <div className="mt-10 p-6 border border-indigo-200 bg-indigo-50 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-indigo-800">
                Menu for {savedMenu.day} ({savedMenu.date})
              </h3>
              <div className="flex gap-4">
                <button
                  onClick={handleEdit}
                  className="text-blue-600 font-semibold text-sm hover:underline"
                >
                  Edit Menu
                </button>
                <button
                  onClick={handleDelete}
                  className="text-red-600 font-semibold text-sm hover:underline"
                >
                  Delete Menu
                </button>
              </div>
            </div>
            {Object.keys(savedMenu.meals).map((meal) => (
              <div key={meal} className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 capitalize">{meal}</h4>
                <p><strong>Items:</strong> {savedMenu.meals[meal].items}</p>
                <p><strong>Time:</strong> {savedMenu.meals[meal].startTime} - {savedMenu.meals[meal].endTime}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
