import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Login from './components/Login';
import VendorDashboard from './pages/VendorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { useAppcontext } from './context/Appcontext';
import About from './pages/Aboutus';
import Contact from './pages/Contactus';
import ProtectedRoute from './components/ProtectedRoute';
import StudentVendorMenu from './pages/StudentVendorMenu';
import ProfileCompletion from './components/ProfileCompletion';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    ShowStudentLogin,
    setShowStudentLogin,
    ShowVendorLogin,
    setShowVendorLogin,
    setStudent,
    setSeller
  } = useAppcontext();
  
  const isSellerPath = location.pathname.includes("seller") || location.pathname.includes("vendor");
  
  // Check for existing session on initial load
  useEffect(() => {
    const checkAuth = () => {
      try {
        // Check for student session
        const studentData = localStorage.getItem('currentStudent');
        if (studentData) {
          const student = JSON.parse(studentData);
          if (student && student.token) {
            setStudent(student);
            // If on home page, redirect to student dashboard
            if (location.pathname === '/' || location.pathname === '') {
              navigate('/student/dashboard');
            }
            return;
          }
        }
        
        // Check for vendor session (if needed)
        const vendorData = localStorage.getItem('currentVendor');
        if (vendorData) {
          const vendor = JSON.parse(vendorData);
          if (vendor && vendor.token) {
            setSeller(vendor);
            if (location.pathname === '/' || location.pathname === '') {
              navigate('/vendor/dashboard');
            }
          }
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        // Clear invalid data
        localStorage.removeItem('currentStudent');
        localStorage.removeItem('currentVendor');
      }
    };
    
    checkAuth();
  }, [navigate, location.pathname, setStudent, setSeller]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar always shown now */}
      <Navbar
        setShowStudentLogin={setShowStudentLogin}
        setShowVendorLogin={setShowVendorLogin}
      />

      {/* Login Modals */}
      {ShowStudentLogin && (
        <Login onClose={() => setShowStudentLogin(false)} />
      )}
      {ShowVendorLogin && (
        <Login onClose={() => setShowVendorLogin(false)} isVendor />
      )}

      {/* Main Page Content */}
      <div className="flex-grow px-6 pt-[80px]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route 
            path="/student/complete-profile" 
            element={
              <ProtectedRoute requiredRole="student">
                <ProfileCompletion />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/student/dashboard" 
            element={
              <ProtectedRoute requiredRole="student">
                <StudentDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/vendor/dashboard" 
            element={
              <ProtectedRoute requiredRole="vendor">
                <VendorDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="/student/menu/:vendorEmail" element={<StudentVendorMenu />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </div>
            
        <div className="mt-10">
          <Footer />
        </div>
      
    </div>
  );
};

export default App;