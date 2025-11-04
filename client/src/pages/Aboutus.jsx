// src/pages/About.jsx
import React from "react";
import { assets } from "../assets/assets";

const About = () => {
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
      <section className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-24 flex flex-col md:flex-row items-center justify-between gap-10">
        
        {/* Left Text Section */}
        <div className="md:w-1/2 space-y-6 animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            🍽️ About{" "}
            <span className="text-green-600">
              EveryDayMeal
            </span>
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed">
            <strong className="text-purple-300">EveryDayMeal</strong> is a
            next-gen platform that connects{" "}
            <span className="font-semibold text-pink-400">
              students and local food vendors
            </span>{" "}
            to simplify how daily meals are discovered, ordered, and enjoyed.
          </p>

          <p className="text-gray-700">
            Our goal is to help students find affordable and healthy food
            quickly — while empowering vendors to easily share menus and updates
            in real time.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-green-600 mb-3">🎯 Our Mission</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                To redefine student dining by building a community-driven
                ecosystem focused on nutrition, affordability, and trust.
              </p>
            </div>

            <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all">
              <h3 className="text-2xl font-bold text-green-600 mb-3">🌟 Our Vision</h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Empower students and vendors through innovation, ensuring
                transparency and seamless dining experiences every day.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
