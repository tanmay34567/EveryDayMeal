import React, { useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { toast } from "react-hot-toast";
import { contactService } from "../services";

const Contact = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "+91",
    subject: "",
    message: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [characterCount, setCharacterCount] = useState(0);

  useEffect(() => {
    const student = JSON.parse(localStorage.getItem("student"));
    const vendor = JSON.parse(localStorage.getItem("vendor"));
    if (student || vendor) {
      const user = student || vendor;
      setUserData({
        name: user.name || "",
        email: user.email || "",
        phone: user.contactNumber || "+91",
        subject: "",
        message: "",
      });
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!userData.name.trim() || userData.name.trim().length < 3)
      newErrors.name = "Name must be at least 3 characters";
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!userData.email.trim() || !emailRegex.test(userData.email))
      newErrors.email = "Enter a valid email";
    if (userData.phone.replace("+91", "").length !== 10)
      newErrors.phone = "Enter 10-digit phone number";
    if (!userData.subject.trim()) newErrors.subject = "Subject is required";
    if (!userData.message.trim() || userData.message.length < 20)
      newErrors.message = "Message must be 20+ characters";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);
    try {
      await contactService.sendMessage(userData);
      toast.success("Message sent successfully!");
      setSubmitted(true);
      setUserData({ name: "", email: "", phone: "+91", subject: "", message: "" });
      setCharacterCount(0);
      setTimeout(() => setSubmitted(false), 4000);
    } catch {
      toast.error("Error sending message. Try again!");
    } finally {
      setLoading(false);
    }
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

      {/* Main Section */}
      <section className="max-w-6xl mx-auto px-6 md:px-12 lg:px-20 py-24 flex flex-col md:flex-row items-center justify-between gap-10">
        {/* Left Info Section */}
        <div className="md:w-1/2 space-y-6 animate-fade-up">
          <h1 className="text-5xl md:text-6xl font-extrabold leading-tight text-gray-900">
            📬 Contact{" "}
            <span className="text-green-600">
              EveryDayMeal
            </span>
          </h1>

          <p className="text-gray-700 text-lg leading-relaxed mt-4">
            Have a question, feedback, or just want to say hi? We’d love to hear from you!
            Reach out using the form, and we’ll get back to you as soon as possible.
          </p>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <span className="text-3xl">📍</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Location</h3>
                <p className="text-sm text-gray-700">Pune, India</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <span className="text-3xl">📞</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Phone</h3>
                <p className="text-sm text-gray-700">+91 8080065293</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <span className="text-3xl">📧</span>
              <div>
                <h3 className="text-lg font-bold text-gray-900">Email</h3>
                <p className="text-sm text-gray-700">everydaymeal80@gmail.com</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Form Section */}
        <div className="md:w-1/2 flex justify-center relative animate-fade-in">
          <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-2xl shadow-lg p-8 space-y-6">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Send Us a Message</h2>
            {submitted ? (
              <div className="text-center text-green-700 bg-green-100 p-6 rounded-2xl border border-green-300">
                ✅ Thank you! We'll get back to you soon.
              </div>
            ) : (
              <div className="space-y-4">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Your name"
                  />
                  {errors.name && <span className="text-red-400 text-xs">{errors.name}</span>}
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    value={userData.email}
                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="example@gmail.com"
                  />
                  {errors.email && <span className="text-red-400 text-xs">{errors.email}</span>}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="text"
                    value={userData.phone}
                    onChange={(e) => setUserData({ ...userData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="+91XXXXXXXXXX"
                  />
                  {errors.phone && <span className="text-red-400 text-xs">{errors.phone}</span>}
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={userData.subject}
                    onChange={(e) => setUserData({ ...userData, subject: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Subject"
                  />
                  {errors.subject && <span className="text-red-400 text-xs">{errors.subject}</span>}
                </div>

                {/* Message */}
                <div>
                  <label className="text-purple-300 font-semibold">
                    Message{" "}
                    <span
                      className={`text-xs ml-2 ${
                        characterCount < 20
                          ? "text-red-400"
                          : characterCount > 500
                          ? "text-yellow-400"
                          : "text-green-400"
                      }`}
                    >
                      {characterCount}/1000
                    </span>
                  </label>
                  <textarea
                    rows="4"
                    value={userData.message}
                    onChange={(e) => {
                      setUserData({ ...userData, message: e.target.value });
                      setCharacterCount(e.target.value.length);
                    }}
                    className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    placeholder="Type your message..."
                  />
                  {errors.message && (
                    <span className="text-red-400 text-xs">{errors.message}</span>
                  )}
                </div>

                {/* Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-500 hover:bg-green-600 text-white text-lg font-semibold py-4 rounded-xl transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </div>
            )}
          </form>
        </div>
      </section>
    </div>
  );
};

export default Contact;
