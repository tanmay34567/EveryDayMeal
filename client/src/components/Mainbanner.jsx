import React from 'react';
import { assets } from '../assets/assets';

const Mainbanner = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Fixed Background Image */}
      <img
        src={assets.main_banner_bg}
        alt="banner"
        className="fixed top-0 left-0 w-full h-screen object-cover z-[-1] animate-slow-spin"
      />

      {/* Overlay and Text */}
      <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent flex flex-col justify-center px-6 sm:px-12 md:px-24">
        <h1 className="text-white text-3xl sm:text-5xl md:text-6xl font-extrabold leading-tight max-w-[700px] animate-fade-in">
          Welcome to <span className="text-yellow-400">EveryDay-Meal</span>
        </h1>
        <p className="mt-4 text-base sm:text-lg md:text-xl text-gray-200 max-w-[600px]">
          Fresh, flavorful, and made with love — enjoy wholesome meals every day.
        </p>
      </div>
    </div>
  );
};

export default Mainbanner;
