import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";

const Contact = () => {
  const [userData, setUserData] = useState({ name: "", email: "", message: "" });

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    const vendor = JSON.parse(localStorage.getItem("vendor"));

    if (student) {
      setUserData((prev) => ({ ...prev, name: student.name, email: student.email }));
    } else if (vendor) {
      setUserData((prev) => ({ ...prev, name: vendor.name, email: vendor.email }));
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();

    // Retrieve existing messages from localStorage, or initialize an empty array if not available
    const existingMessages = JSON.parse(localStorage.getItem("contactMessages")) || [];

    // Add the new message to the existing messages array
    existingMessages.push(userData);

    // Save the updated messages array back to localStorage
    localStorage.setItem("contactMessages", JSON.stringify(existingMessages));

    // Optional: show a message or reset the form
    alert("Your message has been saved!");
    setUserData({ name: "", email: "", message: "" });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
          {/* Fixed Background Image */}
          <img
            src={assets.bg}
            alt="bg"
            className="fixed top-0 left-0 w-full h-screen object-cover z-[-1] animate-slow-spin"
          />
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8 h-[500px] overflow-y-auto bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-indigo-600 mb-4">Contact Us</h1>
      <p className="text-gray-700 text-lg mb-4">
        Have questions, suggestions, or just want to say hi?
      </p>
      <p className="text-gray-600 mb-6">
        We'd love to hear from you. Reach out using the form below or connect with us directly through email.
      </p>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={userData.name}
            onChange={(e) => setUserData({ ...userData, name: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your email"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Message</label>
          <textarea
            rows="4"
            value={userData.message}
            onChange={(e) => setUserData({ ...userData, message: e.target.value })}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Your message..."
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="bg-indigo-600 text-white px-6 py-2 rounded-md hover:bg-indigo-700 transition"
        >
          Send Message
        </button>
      </form>
    </div>
    </div>
    
  );
};

export default Contact;
