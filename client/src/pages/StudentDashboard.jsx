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
  const { Student } = useAppcontext();
  
  // Check if profile is complete, redirect to profile completion if not
  useEffect(() => {
    if (Student) {
      const needsProfileCompletion = 
        !Student.name || 
        Student.name === 'New User' || 
        !Student.contactNumber || 
        Student.contactNumber.startsWith('TEMP-');
      
      if (needsProfileCompletion) {
        console.log('Profile incomplete, redirecting to profile completion');
        navigate('/student/complete-profile', { replace: true });
      }
    }
  }, [Student, navigate]);
  
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

    // Always fetch vendors, even if Student is not set
    fetchVendors();
    
    // Log the Student context to help with debugging
    console.log('Student context:', Student);
  }, []);

  const goToMenu = (vendorEmail) => {
    navigate(`/student/menu/${encodeURIComponent(vendorEmail)}`);
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

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24">
        <div className="text-center mb-12 animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            🎓 Student{" "}
            <span className="text-green-600">
              Dashboard
            </span>
          </h1>
          <p className="text-gray-700 mt-4 text-lg max-w-3xl mx-auto leading-relaxed">
            Explore the list of food vendors serving delicious and affordable
            meals around your campus. Click on any vendor to view their live
            menu 🍽️.
          </p>
        </div>

        {/* Vendors Section */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-12 w-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center bg-red-50 border border-red-300 rounded-2xl p-8 hover:border-red-400 transition-all duration-300">
            <div className="text-5xl mb-4">⚠️</div>
            <p className="text-red-600 font-semibold text-lg">{error}</p>
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center bg-green-50 border border-green-200 rounded-2xl p-8 hover:border-green-300 transition-all duration-300">
            <div className="text-6xl mb-4">🍱</div>
            <p className="text-gray-600 italic text-lg">
              No vendors have uploaded menus yet
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in">
            {vendors.map((vendor, index) => (
              <div
                key={vendor.email}
                onClick={() => goToMenu(vendor.email)}
                className="group bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-green-500/30 hover:shadow-2xl hover:scale-[1.05] hover:border-green-400 transition-all duration-500 p-6 cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <h2 className="text-2xl font-bold text-gray-900 mb-2 relative z-10 group-hover:text-green-600 transition-colors">
                  🏪 {capitalize(vendor.messName) || capitalize(vendor.name)}
                </h2>
                <p className="text-gray-600 text-sm mb-4 relative z-10 group-hover:text-gray-700 transition-colors">
                  📧 {vendor.email}
                </p>

                <div className="flex items-center justify-between text-sm relative z-10 bg-green-50 rounded-lg p-3 group-hover:bg-green-100 transition-all">
                  <span className="font-bold text-yellow-600">
                    ⭐ {Number(vendor.averageRating || 0).toFixed(2)} / 5
                  </span>
                  <span className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-full">
                    {vendor.reviewCount || 0} reviews
                  </span>
                </div>

              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default StudentDashboard;
