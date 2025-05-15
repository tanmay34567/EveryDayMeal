import React, { useState, useEffect, useRef } from "react";
import { useAppcontext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import { vendorMenus } from "../services";
import { useNavigate } from "react-router-dom";

const capitalize = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
};

const VendorDashboard = () => {
  const [date, setDate] = useState("");
  const [day, setDay] = useState("");
  const [savedMenu, setSavedMenu] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [menuData, setMenuData] = useState({
    breakfast: { items: "", startTime: "", endTime: "" },
    lunch: { items: "", startTime: "", endTime: "" },
    dinner: { items: "", startTime: "", endTime: "" },
  });

  const { seller } = useAppcontext();
  const navigate = useNavigate();
  const formRef = useRef(null);
  
  // Prevent back button navigation
  useEffect(() => {
    // Function to handle popstate (back/forward button) events
    const handlePopState = (event) => {
      // Prevent the default action
      event.preventDefault();
      
      // Push the current state again to replace the history entry
      window.history.pushState(null, document.title, window.location.pathname);
      
      // Optional: Show a message to the user
      console.log("Back navigation prevented on vendor dashboard");
    };
    
    // Push a new state to the history when component mounts
    window.history.pushState(null, document.title, window.location.pathname);
    
    // Add event listener for popstate
    window.addEventListener('popstate', handlePopState);
    
    // Clean up the event listener when component unmounts
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Using our vendorService instead of direct axios calls

  // Fetch saved menu on mount or when seller changes
  useEffect(() => {
    if (!seller) return;

    const fetchMenu = async () => {
      try {
        const data = await vendorMenus.getMenus();
        // If data exists, set it as the saved menu
        if (data) {
          setSavedMenu(data);
          console.log('Menu loaded successfully:', data);
        } else {
          // If no menu exists yet, just set savedMenu to null
          setSavedMenu(null);
          console.log('No menu exists for this vendor yet');
        }
      } catch (err) {
        console.error("Failed to fetch saved menu:", err);
        // Keep savedMenu as null
        setSavedMenu(null);
      }
    };

    fetchMenu();
  }, [seller]);

  const isDateAndDayMatching = () => {
    if (!date || !day) return false;

    const selectedDate = new Date(date);
    const selectedDayIndex = selectedDate.getDay();
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
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

  const handleSubmit = async () => {
    if (!date || !day) {
      alert("Please enter date and day.");
      return;
    }

    if (!isDateAndDayMatching()) {
      alert("Selected day and date do not match. Please correct them.");
      return;
    }

    if (!seller) {
      alert("You must be logged in to save menu.");
      return;
    }

    // Payload - include vendor email and name as required by the backend
    const payload = {
      vendorEmail: seller.email,
      vendorName: seller.name,
      date,
      day,
      meals: menuData,
    };

    try {
      const response = await vendorMenus.createMenu(payload);
      setSavedMenu(response);
      setIsEditing(false);
      alert("Menu saved successfully!");
    } catch (error) {
      console.error("Error saving menu:", error);
      alert("Failed to save menu.");
    }
  };

  const handleDelete = async () => {
    if (!seller) {
      alert("You must be logged in to delete menu.");
      return;
    }

    try {
      const response = await vendorMenus.deleteMenu();
      
      // Check if the response indicates no menu existed to delete
      if (response && response.noMenuExists) {
        // This is an expected case for new vendors
        alert("No menu exists to delete.");
      } else {
        // A menu was successfully deleted
        alert("Menu deleted successfully.");
      }
      
      // In either case, reset the state
      setSavedMenu(null);
      setIsEditing(false);
    } catch (error) {
      console.error("Error deleting menu:", error);
      alert("Failed to delete menu.");
    }
  };

  const handleEdit = () => {
    if (!savedMenu) return;

    setDate(savedMenu.date);
    setDay(savedMenu.day);
    setMenuData(savedMenu.meals || {});
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
        endTime: "",
      },
    }));
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      <img
        src={assets.bg}
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1] bg-animation"
      />
      <div
        ref={formRef}
        className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-8"
      >
        <h1 className="text-4xl font-bold text-center text-indigo-700 mb-8">
          <span>{capitalize(seller?.name) || "Vendor"}</span> Dashboard
        </h1>
        
        {/* Form for creating/editing menu */}
        <div className="mb-8">
          {/* Welcome message for new vendors */}
          {!savedMenu && (
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Welcome to your dashboard! You haven't created any menus yet. Use the form below to create your first menu.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Day & Date */}
          <div className="mb-6">
            <label className="block font-semibold text-lg mb-1 text-gray-700">
              Select Day
            </label>
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 shadow-sm"
            >
              <option value="">Day</option>
              {[
                "Monday",
                "Tuesday",
                "Wednesday",
                "Thursday",
                "Friday",
                "Saturday",
                "Sunday",
              ].map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-6">
            <label className="block font-semibold text-lg mb-1 text-gray-700">
              Select Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300"
            />
          </div>

          {/* Meals */}
          {Object.keys(menuData).map((meal) => (
            <div
              key={meal}
              className="mb-8 bg-gray-50 border border-gray-200 p-5 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold capitalize text-indigo-600">
                  {meal}
                </h2>
                {isEditing && (
                  <button
                    onClick={() => handleResetMeal(meal)}
                    className="text-sm text-red-600 font-medium hover:underline"
                  >
                    Reset {meal}
                  </button>
                )}
              </div>

              <label className="block font-medium mb-1 text-gray-700">
                Menu Items
              </label>
              <input
                type="text"
                value={menuData[meal].items}
                onChange={(e) => handleChange(meal, "items", e.target.value)}
                placeholder={`Enter ${meal} menu...`}
                className="mb-4 w-full p-3 rounded-lg border border-gray-300"
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    Start Time
                  </label>
                  <input
                    type="time"
                    value={menuData[meal].startTime}
                    onChange={(e) => handleChange(meal, "startTime", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300"
                  />
                </div>
                <div>
                  <label className="block font-medium mb-1 text-gray-700">
                    End Time
                  </label>
                  <input
                    type="time"
                    value={menuData[meal].endTime}
                    onChange={(e) => handleChange(meal, "endTime", e.target.value)}
                    className="w-full p-3 rounded-lg border border-gray-300"
                  />
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
        </div>

        {/* Display current menu if it exists */}
        {!savedMenu ? (
          <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200">
            <div className="text-center mb-6">
              <h3 className="text-xl font-medium text-gray-800 mb-2">Welcome to Your Dashboard!</h3>
              <p className="text-gray-600 mb-2">You haven't created a menu yet.</p>
              <p className="text-gray-500 text-sm">Create your first menu to start receiving orders from students.</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-all flex items-center"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Create Your First Menu
            </button>
          </div>
        ) : (
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
            {savedMenu.meals && Object.entries(savedMenu.meals).map(([meal, data]) => (
              <div key={meal} className="mb-4">
                <h4 className="text-lg font-semibold text-gray-800 capitalize">
                  {meal}
                </h4>
                <p>
                  <strong>Items:</strong> {data.items}
                </p>
                <p>
                  <strong>Time:</strong> {data.startTime} - {data.endTime}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorDashboard;
