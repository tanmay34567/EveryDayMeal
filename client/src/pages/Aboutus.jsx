// src/pages/About.jsx
import React from 'react';
import { assets } from '../assets/assets';

const About = () => {
  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Fixed Background Image */}
      <img
        src={assets.bg}
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1] bg-animation"
      />

      {/* Content Container */}
      <div className="max-w-4xl mx-auto my-16 py-12 px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-2xl backdrop-blur-md bg-opacity-90">
        <h1 className="text-3xl font-bold text-indigo-600 mb-4">About Us</h1>
        <p className="text-gray-700 text-lg mb-4">
          Welcome to <strong>EveryDayMeal</strong> — your go-to platform for connecting students and vendors for daily meals.
        </p>
        <p className="text-gray-600">
          EveryDayMeal is designed to simplify, enhance, and save time in the daily food search for students by partnering with local vendors.
          Our platform displays real-time menus from nearby messes within a 2 km radius, helping students quickly find affordable and healthy meals.
          Whether you're a student looking for convenient options or a vendor aiming to connect with your audience, EveryDayMeal has you covered.
        </p>
      </div>
    </div>
  );
};

export default About;
