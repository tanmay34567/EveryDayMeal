import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { studentMeals } from "../services";
import { useAppcontext } from "../context/Appcontext";

const capitalize = (str) => {
  if (!str) return "";
  return str
    .split(" ")
    .map((w) => w && w.length > 0 ? w[0].toUpperCase() + w.slice(1).toLowerCase() : "")
    .join(" ");
};

const StudentDashboard = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { student } = useAppcontext();
  
  // Prevent back button navigation
  useEffect(() => {
    // Function to handle popstate (back/forward button) events
    const handlePopState = (event) => {
      // Prevent the default action
      event.preventDefault();
      
      // Push the current state again to replace the history entry
      window.history.pushState(null, document.title, window.location.pathname);
      
      // Optional: Show a message to the user
      console.log("Back navigation prevented on student dashboard");
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

  useEffect(() => {
    // Fetch vendors with menus from the API
    const fetchVendors = async () => {
      try {
        setLoading(true);
        const availableVendors = await studentMeals.getAvailableVendors();
        
        // Validate vendor data to ensure each vendor has a name property
        const validVendors = (availableVendors || []).filter(vendor => 
          vendor && typeof vendor === 'object' && vendor.name && vendor.email
        );
        
        if (validVendors.length > 0) {
          setVendors(validVendors);
          setError(null);
        } else {
          // If no valid vendors were returned, set empty array and show message
          console.log('No vendors available');
          setVendors([]);
          setError('No vendors are currently available. Please check back later.');
        }
      } catch (err) {
        console.error('Error fetching vendors:', err);
        // Set empty array and show error message
        setVendors([]);
        setError('Unable to fetch vendors. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    // Always fetch vendors, even if student is not set
    fetchVendors();
    
    // Log the student context to help with debugging
    console.log('Student context:', student);
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
            className="fixed top-0 left-0 w-full h-full object-cover z-[-1] bg-animation"
          />
      <div className="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-center text-indigo-700 mb-6">Student Dashboard</h1>
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Available Vendors:</h2>

        {loading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <p className="text-red-500 text-center py-4">{error}</p>
        ) : vendors.length === 0 ? (
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
