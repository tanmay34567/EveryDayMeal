import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { assets } from "../assets/assets";
import { studentMeals, studentReviews } from "../services";
import { useAppcontext } from "../context/Appcontext";

const capitalize = (str = "") =>
    str
      .split(" ")
      .map((w) => (w ? w[0].toUpperCase() + w.slice(1).toLowerCase() : ""))
      .join(" ");

const StudentVendorMenu = () => {
  const { vendorEmail } = useParams();
  const [menu, setMenu] = useState(null);
  const [vendorName, setVendorName] = useState("");
  const [vendorInfo, setVendorInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { navigate, Student } = useAppcontext();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewCount, setReviewCount] = useState(0);
  const [myRating, setMyRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [saving, setSaving] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  useEffect(() => {
    const fetchVendorMenu = async () => {
      try {
        setLoading(true);
        const menuData = await studentMeals.getVendorMenu(vendorEmail);
        
        if (menuData) {
          setMenu(menuData);
          // Use messName if available, otherwise fall back to vendorName
          const displayName = menuData.vendorInfo?.messName || menuData.vendorName || "";
          setVendorName(displayName);
          setVendorInfo(menuData.vendorInfo || null);
        } else {
          // If no menu data is returned, set menu to null and show a message
          console.log("No menu found for this vendor");
          setMenu(null);
          // Extract a readable vendor name from the email for display purposes
          const readableVendorName = vendorEmail.split('@')[0].split('.').map(capitalize).join(' ');
          setVendorName(readableVendorName);
          setError(`${readableVendorName} hasn't created a menu yet.`);
        }
      } catch (err) {
        console.error("Error fetching vendor menu:", err);
        // Set menu to null and show an error message
        setMenu(null);
        // Extract a readable vendor name from the email for display purposes
        const readableVendorName = vendorEmail.split('@')[0].split('.').map(capitalize).join(' ');
        setVendorName(readableVendorName);
        setError(`Unable to fetch menu for ${readableVendorName}. Please try again later.`);
      } finally {
        setLoading(false);
      }
    };

    // Always fetch menu if vendorEmail is available, regardless of student authentication
    if (vendorEmail) {
      fetchVendorMenu();
    }
  }, [vendorEmail]);

  const handleGoBack = (e) => {
    e.preventDefault();
    navigate(-1); // This will go back to the previous page in history
  };

  const loadReviewsPage = async (targetPage = 1) => {
    const res = await studentReviews.getByVendor(vendorEmail, { page: targetPage, limit });
    if (res?.success) {
      const list = res.data.reviews || [];
      setAverageRating(res.data.averageRating || 0);
      setReviewCount(res.data.count || 0);
      setHasMore(!!res.data.hasMore);
      if (targetPage === 1) {
        setReviews(list);
      } else {
        setReviews(prev => [...prev, ...list]);
      }
      const mine = (targetPage === 1 ? list : [...reviews, ...list]).find(r => r?.student?.email === (Student?.email || ""));
      if (mine) {
        setMyRating(mine.rating);
        setMyComment(mine.comment || "");
      } else if (targetPage === 1) {
        setMyRating(0);
        setMyComment("");
      }
    }
  };

  useEffect(() => {
    if (!vendorEmail) return;
    // reset pagination on vendor change
    setPage(1);
    loadReviewsPage(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vendorEmail, Student]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!Student) return;
    if (!myRating || myRating < 1 || myRating > 5) return;
    try {
      setSaving(true);
      const res = await studentReviews.upsert(vendorEmail, { rating: Number(myRating), comment: myComment, vendorName });
      if (res?.success) {
        setPage(1);
        await loadReviewsPage(1);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteReview = async () => {
    if (!Student) return;
    try {
      setSaving(true);
      const res = await studentReviews.remove(vendorEmail);
      if (res?.success) {
        setPage(1);
        await loadReviewsPage(1);
        setMyRating(0);
        setMyComment("");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleLoadMore = async () => {
    if (!hasMore || loadingMore) return;
    try {
      setLoadingMore(true);
      const next = page + 1;
      await loadReviewsPage(next);
      setPage(next);
    } finally {
      setLoadingMore(false);
    }
  };

  const Star = ({ filled, onClick, onMouseEnter, onMouseLeave }) => (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className={`w-6 h-6 text-yellow-400 ${filled ? '' : 'opacity-40'}`}
      aria-label={filled ? 'filled star' : 'empty star'}
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.88 8.72c-.783-.57-.38-1.81.588-1.81H6.93a1 1 0 00.95-.69l1.07-3.292z" />
      </svg>
    </button>
  );

  const [hoverRating, setHoverRating] = useState(0);

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
    
      <div className="max-w-7xl mx-auto px-4 py-4">
        {/* Compact Header with Vendor Info */}
        <div className="mb-4 bg-white border border-gray-200 rounded-xl shadow-md p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-center gap-3">
              <button 
                onClick={handleGoBack}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300 font-semibold text-sm"
              >
                ← Back
              </button>
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900">
                  <span className="text-green-600">{capitalize(vendorName)}</span> 🍽️
                </h1>
                {vendorInfo && (
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-1">
                    <span>📧 {vendorInfo.email}</span>
                    {vendorInfo.contactNumber && <span>📞 +91 {vendorInfo.contactNumber}</span>}
                    {vendorInfo.address && <span>📍 {vendorInfo.address}{vendorInfo.city && `, ${vendorInfo.city}`}</span>}
                  </div>
                )}
              </div>
            </div>
            <div className="text-xs bg-green-50 px-3 py-2 rounded-full border border-green-200 shadow-sm whitespace-nowrap">
              <span className="text-yellow-600 font-bold text-sm">⭐ {averageRating}</span>
              <span className="text-gray-700"> / 5 ({reviewCount})</span>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="h-12 w-12 border-4 border-green-300 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="text-center bg-red-50 border border-red-300 rounded-2xl p-8">
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <Link 
              to="/student/dashboard" 
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg font-semibold"
            >
              Return to Dashboard
            </Link>
          </div>
        ) : !menu ? (
          <div className="text-center bg-green-50 border border-green-200 rounded-2xl p-8">
            <div className="text-6xl mb-4">🍱</div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Menu Available</h3>
            <p className="text-gray-600 mb-6">{capitalize(vendorName)} hasn't created a menu yet.</p>
            <Link 
              to="/student/dashboard" 
              className="inline-block bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl hover:scale-105 transition-all duration-300 shadow-lg font-semibold"
            >
              ← Return to Dashboard
            </Link>
          </div>
        ) : (
          <>
            {/* Menu Section - Main Focus */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-2xl font-bold text-gray-900">🍴 Today's Menu</h2>
                <div className="text-center bg-green-50 border border-green-200 rounded-lg px-4 py-2">
                  <p className="text-green-600 font-bold text-sm">{menu.day}</p>
                  <p className="text-gray-600 text-xs">{menu.date}</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {Object.entries(menu.meals).map(([meal, data]) => (
                <div
                  key={meal}
                  className="group bg-white border-2 border-gray-200 rounded-2xl shadow-lg hover:shadow-green-500/40 hover:border-green-400 transition-all duration-300 p-6 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 bg-green-500 text-white text-sm font-bold px-4 py-2 rounded-bl-xl shadow-md">
                    {data.startTime} - {data.endTime}
                  </div>
                  <h3 className="text-2xl font-bold capitalize text-gray-900 mb-4 relative z-10 group-hover:text-green-600 transition-colors">🍴 {meal}</h3>
                  <div className="relative z-10">
                    <p className="text-gray-700 text-base leading-relaxed">{data.items}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Reviews Section - Compact */}
            <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4 shadow-md">
              <h2 className="text-lg font-bold text-gray-900 mb-3">⭐ Student Reviews</h2>

              {Student ? (
                <form onSubmit={handleSubmitReview} className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 hover:border-green-300 transition-all duration-300">
                  <div className="flex flex-col gap-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <label className="font-semibold text-gray-900 text-sm">Your Rating:</label>
                      {[1,2,3,4,5].map((n) => (
                        <Star
                          key={n}
                          filled={(hoverRating || myRating) >= n}
                          onClick={() => setMyRating(n)}
                          onMouseEnter={() => setHoverRating(n)}
                          onMouseLeave={() => setHoverRating(0)}
                        />
                      ))}
                      {myRating > 0 && (
                        <button type="button" onClick={() => setMyRating(0)} className="text-xs text-green-600 underline ml-2 hover:text-green-700">Clear</button>
                      )}
                    </div>
                    <input
                      type="text"
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm text-black placeholder-gray-500 focus:ring-2 focus:ring-green-500"
                      placeholder="Write a short review (optional)"
                      value={myComment}
                      onChange={(e) => setMyComment(e.target.value)}
                    />
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="submit"
                        disabled={saving || !myRating}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm rounded-lg disabled:opacity-50 hover:scale-105 transition-all duration-300 font-semibold"
                      >
                        {saving ? '⏳ Saving...' : myRating ? '💾 Save Review' : 'Select Rating'}
                      </button>
                      {reviews.find(r => r?.student?.email === (Student?.email || "")) && (
                        <button
                          type="button"
                          onClick={handleDeleteReview}
                          disabled={saving}
                          className="bg-red-500/80 text-white px-4 py-2 text-sm rounded-lg disabled:opacity-50 hover:bg-red-600 transition-all font-semibold"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </form>
              ) : (
                <div className="text-xs text-gray-700 mb-3 bg-green-50 border border-green-200 rounded-lg p-2">Login as student to add a review.</div>
              )}

              <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                {reviews.length === 0 ? (
                  <div className="text-center text-gray-600 italic py-3 text-sm">No reviews yet. Be the first to review! 📝</div>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-white hover:border-green-300 transition-all duration-300">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-1">
                        <div className="font-semibold text-gray-900 break-words text-sm">{r?.student? `${r.student.name || 'Student'}`: 'Unknown Student'}</div>
                        <span className="text-yellow-600 font-bold text-xs">⭐ {r.rating}/5</span>
                      </div>
                      {r.comment && <p className="text-xs text-gray-700 italic mt-1">"{r.comment}"</p>}
                      <div className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleDateString()}</div>
                    </div>
                  ))
                )}
              </div>

              {hasMore && (
                <div className="mt-3 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-4 py-2 text-sm bg-green-500 hover:bg-green-600 text-white rounded-lg disabled:opacity-50 transition-all duration-300 font-semibold"
                  >
                    {loadingMore ? '⏳ Loading...' : '📥 Load More Reviews'}
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default StudentVendorMenu;
