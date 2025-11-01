import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Mainbanner from '../components/Mainbanner';
import { useAppcontext } from '../context/Appcontext';

const Home = () => {
  const { Student, seller } = useAppcontext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // spinner state

  useEffect(() => {
    // Check if logged in and redirect accordingly
    if (Student?.token) {
      navigate('/student/dashboard');
    } else if (seller?.token) {
      navigate('/vendor/dashboard');
    } else {
      setLoading(false); // show banner if not logged in
    }
  }, [Student, seller, navigate]);

  // 🌀 Simple centered loading spinner
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  // Show Mainbanner only for non-logged-in users
  return (
    <div className="mt-10">
      <Mainbanner />
    </div>
  );
};

export default Home;
