import React from 'react';
import { assets } from '../assets/assets';
import { useAppcontext } from '../context/Appcontext';

const Mainbanner = () => {
  const { setShowStudentLogin, setShowVendorLogin } = useAppcontext();

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
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-center min-h-screen px-6 sm:px-12 md:px-24 py-20 gap-12">
        {/* Left Side - Text Content */}
        <div className="max-w-2xl md:w-1/2">
          {/* Main Heading */}
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold leading-tight mb-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-gray-900">Welcome to </span>
            <span className="text-green-600">EveryDay-Meal</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-700 max-w-3xl mb-8 leading-relaxed animate-fade-in" style={{ animationDelay: '0.4s' }}>
            Fresh, flavorful, and made with love — enjoy wholesome meals every day.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 animate-fade-in" style={{ animationDelay: '0.6s' }}>
            <button
              onClick={() => setShowStudentLogin(true)}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 text-white text-lg font-bold rounded-full hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              🎓 Student Login
            </button>
            
            <button
              onClick={() => setShowVendorLogin(true)}
              className="px-8 py-4 bg-white border-2 border-green-500 text-green-600 text-lg font-bold rounded-full hover:scale-105 hover:bg-green-50 transition-all duration-300 shadow-lg"
            >
              🏪 Vendor Login
            </button>
          </div>
        </div>

        {/* Right Side - Image */}
        <div className="md:w-1/2 flex justify-center items-center animate-fade-in" style={{ animationDelay: '0.6s' }}>
          <div className="relative">
            <img
              src={assets.imgg}
              alt="Food"
              className="w-full max-w-2xl hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Feature Cards Section - Below Hero */}
      <div className="relative z-10 px-6 sm:px-12 md:px-24 pb-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-6xl mx-auto animate-fade-in">
          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="text-5xl mb-3">🍱</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Fresh Daily</h3>
            <p className="text-sm text-gray-600">Prepared fresh every day with quality ingredients</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="text-5xl mb-3">💰</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Affordable</h3>
            <p className="text-sm text-gray-600">Budget-friendly meals for students</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 border border-gray-100">
            <div className="text-5xl mb-3">⭐</div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Top Rated</h3>
            <p className="text-sm text-gray-600">Highly rated by students across campus</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Mainbanner;
