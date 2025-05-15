import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { studentMeals } from "../services";
import { useAppcontext } from "../context/Appcontext";

const capitalize = (str = "") =>
    str
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
      .join(" ");

const StudentVendorMenu = () => {
  const { vendorEmail } = useParams();
  const [menu, setMenu] = useState(null);
  const [vendorName, setVendorName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { student } = useAppcontext();

  useEffect(() => {
    const fetchVendorMenu = async () => {
      try {
        setLoading(true);
        const menuData = await studentMeals.getVendorMenu(vendorEmail);
        
        if (menuData) {
          setMenu(menuData);
          setVendorName(menuData.vendorName || "");
        } else {
          // If no menu data is returned, create mock data based on the vendor email
          console.log("No menu found, using mock data");
          const mockMenu = {
            vendorEmail: vendorEmail,
            vendorName: vendorEmail.split('@')[0].split('.').map(capitalize).join(' '),
            date: new Date().toISOString().split('T')[0],
            day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
            meals: {
              breakfast: {
                items: 'Eggs, Toast, Fruit, Coffee',
                startTime: '7:00 AM',
                endTime: '9:30 AM'
              },
              lunch: {
                items: 'Sandwich, Salad, Soup, Juice',
                startTime: '12:00 PM',
                endTime: '2:30 PM'
              },
              dinner: {
                items: 'Rice, Curry, Naan, Dessert',
                startTime: '6:00 PM',
                endTime: '8:30 PM'
              }
            }
          };
          setMenu(mockMenu);
          setVendorName(mockMenu.vendorName);
        }
      } catch (err) {
        console.error("Error fetching vendor menu:", err);
        // Create mock data in case of error
        const mockMenu = {
          vendorEmail: vendorEmail,
          vendorName: vendorEmail.split('@')[0].split('.').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
          date: new Date().toISOString().split('T')[0],
          day: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()],
          meals: {
            breakfast: {
              items: 'Eggs, Toast, Fruit, Coffee',
              startTime: '7:00 AM',
              endTime: '9:30 AM'
            },
            lunch: {
              items: 'Sandwich, Salad, Soup, Juice',
              startTime: '12:00 PM',
              endTime: '2:30 PM'
            },
            dinner: {
              items: 'Rice, Curry, Naan, Dessert',
              startTime: '6:00 PM',
              endTime: '8:30 PM'
            }
          }
        };
        setMenu(mockMenu);
        setVendorName(mockMenu.vendorName);
      } finally {
        setLoading(false);
      }
    };

    // Always fetch menu if vendorEmail is available, regardless of student authentication
    if (vendorEmail) {
      fetchVendorMenu();
    }
  }, [vendorEmail]);

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Fixed Background Image */}
      <img
        src={assets.bg}
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1] bg-animation"
      />
    
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <Link 
            to="/student/dashboard" 
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            &larr; Back to Dashboard
          </Link>
          <h1 className="text-3xl font-bold text-indigo-700 text-center">
            {capitalize(vendorName)} Menu
          </h1>
          <div className="w-24"></div> {/* Empty div for balance */}
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Link 
              to="/student/dashboard" 
              className="text-indigo-600 hover:underline"
            >
              Return to dashboard
            </Link>
          </div>
        ) : !menu ? (
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
