import React from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
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

const App = () => {
  const {
    ShowStudentLogin,
    setShowStudentLogin,
    ShowVendorLogin,
    setShowVendorLogin,
  } = useAppcontext();

  const location = useLocation();
  const isSellerPath = location.pathname.includes("seller") || location.pathname.includes("vendor");

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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact/>} />
        </Routes>
      </div>

      {/* Footer - not shown on seller/vendor routes */}
      {!isSellerPath && (
        <div className="mt-10">
          <Footer />
        </div>
      )}
    </div>
  );
};

export default App;