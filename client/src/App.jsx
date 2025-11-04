import React, { useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import StudentLogin from './components/StudentLogin';
import VendorLogin from './components/VendorLogin';
import VendorDashboard from './pages/VendorDashboard';
import StudentDashboard from './pages/StudentDashboard';
import AdminDashboard from './pages/AdminDashboard';
import { useAppcontext } from './context/Appcontext';
import About from './pages/Aboutus';
import Contact from './pages/Contactus';
import ProtectedRoute from './components/ProtectedRoute';
import StudentVendorMenu from './pages/StudentVendorMenu';
import ProfileCompletion from './components/ProfileCompletion';
import VendorApplication from './pages/VendorApplication';

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  const {
    ShowStudentLogin,
    setShowStudentLogin,
    ShowVendorLogin,
    setShowVendorLogin,
    Student,
    seller
  } = useAppcontext();
  
  const isVendorApplicationPage = location.pathname === '/vendor/apply';
  
  // Handle redirects based on auth state on initial load
  useEffect(() => {
    // Only redirect if we're on the home page and have authenticated user
    if (location.pathname === '/' || location.pathname === '') {
      if (Student?.token) {
        // Check if student needs to complete profile
        const needsProfileCompletion = 
          !Student.name || 
          Student.name === 'New User' || 
          !Student.contactNumber || 
          Student.contactNumber.startsWith('TEMP-');
        
        if (needsProfileCompletion) {
          navigate('/student/complete-profile', { replace: true });
        } else {
          navigate('/student/dashboard', { replace: true });
        }
      } else if (seller?.token) {
        // Check if admin
        if (seller.isAdmin) {
          navigate('/admin/dashboard', { replace: true });
        } else {
          navigate('/vendor/dashboard', { replace: true });
        }
      }
    }
  }, [Student, seller, location.pathname, navigate]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navbar always shown now */}
      {!isVendorApplicationPage && (
        <Navbar
          setShowStudentLogin={setShowStudentLogin}
          setShowVendorLogin={setShowVendorLogin}
        />
      )}

      {/* Login Modals */}
      {ShowStudentLogin && (
        <StudentLogin onClose={() => setShowStudentLogin(false)} />
      )}
      {ShowVendorLogin && (
        <VendorLogin onClose={() => setShowVendorLogin(false)} />
      )}

      {/* Main Page Content */}
      <div className={`flex-grow ${!isVendorApplicationPage ? 'px-6 pt-[80px]' : ''}`}>
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
          <Route path="/vendor/apply" element={<VendorApplication />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Routes>
      </div>
            
        {!isVendorApplicationPage && (
        <div className="mt-10">
          <Footer />
        </div>
      )}
      
    </div>
  );
};

export default App;