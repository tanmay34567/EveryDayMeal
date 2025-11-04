import React, { useState, useEffect, useRef } from "react";
import { useAppcontext } from "../context/Appcontext";
import { assets } from "../assets/assets";
import { vendorMenus, vendorReviews } from "../services";
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
  const [reviewsData, setReviewsData] = useState({ averageRating: 0, count: 0, reviews: [] });
  const [loadingReviews, setLoadingReviews] = useState(false);
  
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

  // Fetch vendor reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!seller) return;
      try {
        setLoadingReviews(true);
        const res = await vendorReviews.get();
        if (res?.success && res.data) {
          setReviewsData({
            averageRating: res.data.averageRating || 0,
            count: res.data.count || 0,
            reviews: res.data.reviews || []
          });
        }
      } finally {
        setLoadingReviews(false);
      }
    };
    fetchReviews();
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
      {/* Background with Image */}
      <div className="fixed inset-0 z-[-1]">
        <img
          src={assets.bg}
          alt="Background"
          className="w-full h-full object-cover"
        />
      </div>

      <div
        ref={formRef}
        className="max-w-7xl mx-auto px-4 py-4"
      >
        <h1 className="text-2xl md:text-3xl font-extrabold text-center mb-4 text-gray-900">
          🏪 <span className="text-green-600">{capitalize(seller?.messName) || capitalize(seller?.name) || "Vendor"}</span> Dashboard
        </h1>
        
        {/* Form for creating/editing menu */}
        <div className="mb-4">
          {/* Welcome message for new vendors */}
          {!savedMenu && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3 hover:border-blue-300 transition-all duration-300">
              <div className="flex items-center gap-3">
                <div className="text-3xl animate-pulse">ℹ️</div>
                <p className="text-xs text-blue-700">
                  Welcome to your dashboard! You haven't created any menus yet.
                </p>
              </div>
            </div>
          )}

          {/* Day & Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-900">
                📅 Select Day
              </label>
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm shadow-sm focus:ring-2 focus:ring-green-500"
              >
                <option value="" className="bg-white">Day</option>
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((d) => (
                  <option key={d} value={d} className="bg-white">
                    {d}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold text-sm mb-1 text-gray-900">
                📆 Select Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full p-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm shadow-sm focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Meals */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          {Object.keys(menuData).map((meal) => (
            <div
              key={meal}
              className="bg-white border-2 border-gray-200 p-4 rounded-xl shadow-md hover:shadow-green-500/30 hover:border-green-400 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold capitalize text-gray-900">
                  🍴 {meal}
                </h2>
                {isEditing && (
                  <button
                    onClick={() => handleResetMeal(meal)}
                    className="text-xs text-red-600 font-medium hover:text-red-700 transition-colors"
                  >
                    Reset {meal}
                  </button>
                )}
              </div>

              <label className="block font-semibold mb-1 text-gray-900 text-sm">
                Menu Items
              </label>
              <input
                type="text"
                value={menuData[meal].items}
                onChange={(e) => handleChange(meal, "items", e.target.value)}
                placeholder={`Enter ${meal} menu...`}
                className="mb-2 w-full p-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm placeholder-gray-500 focus:ring-2 focus:ring-green-500"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold mb-1 text-gray-900 text-xs">
                    ⏰ Start Time
                  </label>
                  <input
                    type="time"
                    value={menuData[meal].startTime}
                    onChange={(e) => handleChange(meal, "startTime", e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1 text-gray-900 text-xs">
                    ⏱️ End Time
                  </label>
                  <input
                    type="time"
                    value={menuData[meal].endTime}
                    onChange={(e) => handleChange(meal, "endTime", e.target.value)}
                    className="w-full p-2 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-2 focus:ring-green-500"
                  />
                </div>
              </div>
            </div>
          ))}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full bg-green-500 hover:bg-green-600 hover:scale-[1.02] text-white text-base font-semibold py-3 rounded-xl transition-all duration-300 shadow-lg"
          >
            {isEditing ? "✅ Update Menu" : "💾 Save Menu & Timings"}
          </button>
        </div>

        {/* Display current menu if it exists */}
        {!savedMenu ? (
          <div className="flex flex-col items-center justify-center p-6 bg-green-50 border border-green-200 rounded-xl hover:border-green-300 transition-all duration-300">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🍽️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-1">Welcome!</h3>
              <p className="text-gray-600 text-sm mb-2">Create your first menu</p>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg hover:scale-105 transition-all duration-300 shadow-md font-semibold flex items-center gap-2 text-sm"
            >
              <span className="text-xl">+</span>
              Create Your First Menu
            </button>
          </div>
        ) : (
          <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl shadow-md">
            <div className="flex flex-col sm:flex-row justify-between items-center mb-3 gap-2">
              <h3 className="text-lg font-bold text-gray-900">
                📅 Menu for {savedMenu.day} ({savedMenu.date})
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={handleEdit}
                  className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={handleDelete}
                  className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-all"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
              {savedMenu.meals && Object.entries(savedMenu.meals).map(([meal, data]) => (
                <div key={meal} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-white hover:border-green-300 hover:shadow-md transition-all duration-300">
                  <h4 className="text-base font-bold text-gray-900 capitalize mb-1">
                    🍴 {meal}
                  </h4>
                  <p className="text-gray-700 text-xs mb-1">
                    <span className="font-semibold text-green-600">Items:</span> {data.items}
                  </p>
                  <p className="text-gray-700 text-xs">
                    <span className="font-semibold text-green-600">Time:</span> {data.startTime} - {data.endTime}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Reviews Panel */}
        <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl shadow-md">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-3 gap-2">
            <h3 className="text-lg font-bold text-gray-900">⭐ Reviews</h3>
            <div className="text-xs bg-green-50 px-3 py-1 rounded-full border border-green-200 shadow-sm">
              <span className="text-yellow-600 font-bold text-sm">{Number(reviewsData.averageRating || 0).toFixed(2)}</span>
              <span className="text-gray-700"> / 5 ({reviewsData.count})</span>
            </div>
          </div>
          {loadingReviews ? (
            <div className="text-center text-gray-600 py-3 text-sm">Loading reviews...</div>
          ) : reviewsData.reviews.length === 0 ? (
            <div className="text-center text-gray-600 italic py-3 text-sm">No reviews yet. 📝</div>
          ) : (
            <div className="space-y-2 max-h-48 overflow-auto pr-2">
              {reviewsData.reviews.map((r) => (
                <div key={r._id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-white hover:border-green-300 transition-all duration-300">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                    <div className="font-semibold text-gray-900 break-words text-sm">{r?.student ? `${r.student.name || 'Student'}` : 'Unknown Student'}</div>
                    <span className="text-xs text-yellow-600 font-bold">⭐ {r.rating}/5</span>
                  </div>
                  {r.comment ? <div className="text-gray-700 mt-1 break-words italic text-xs">"{r.comment}"</div> : null}
                  <div className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
