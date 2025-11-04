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
      {/* Fixed Background Image */}
      <img
        src={assets.bg}
        alt="Background"
        className="fixed top-0 left-0 w-full h-full object-cover z-[-1] bg-animation"
      />
    
      <div className="max-w-4xl mx-auto bg-white p-4 sm:p-8 rounded-2xl shadow-lg">
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-0 justify-between items-center mb-6 text-center sm:text-left">
          <button 
            onClick={handleGoBack}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors w-full sm:w-auto"
          >
            &larr; Back to Dashboard
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-indigo-700">
            {capitalize(vendorName)} Menu
          </h1>
          <div className="w-24 hidden sm:block"></div> {/* Empty div for balance on larger screens */}
        </div>

        {/* Vendor Information */}
        {vendorInfo && (
          <div className="mb-6 p-4 bg-indigo-50 rounded-lg border border-indigo-100">
            <div className="space-y-1 text-sm">
              <p className="text-gray-700">
                <span className="font-medium">Email:</span> {vendorInfo.email}
              </p>
              {vendorInfo.contactNumber && (
                <p className="text-gray-700">
                  <span className="font-medium">Contact:</span> +91 {vendorInfo.contactNumber}
                </p>
              )}
              {vendorInfo.address && (
                <p className="text-gray-700">
                  <span className="font-medium">Address:</span> {vendorInfo.address}
                  {vendorInfo.city && `, ${vendorInfo.city}`}
                  {vendorInfo.pincode && ` - ${vendorInfo.pincode}`}
                </p>
              )}
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Link 
              to="/student/dashboard" 
              className="text-indigo-600 hover:underline"
            >
              Return to dashboard
            </Link>
          </div>
        ) : !menu ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200 p-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h3 className="text-xl font-medium text-gray-800 mb-2">No Menu Available</h3>
            <p className="text-gray-600 mb-4">{capitalize(vendorName)} hasn't created a menu yet.</p>
            <Link 
              to="/student/dashboard" 
              className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
              </svg>
              Return to Dashboard
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 text-center">
              <p className="text-gray-600 font-bold text-xl">Day: {menu.day}</p>
              <p className="text-gray-600 font-bold text-md">Date: {menu.date}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(menu.meals).map(([meal, data]) => (
                <div
                  key={meal}
                  className="bg-blue-50 p-4 rounded-xl border border-blue-100 shadow-sm"
                >
                  <h3 className="text-xl font-bold capitalize text-indigo-600 mb-2">{meal}</h3>
                  <p className="text-gray-700"><strong>Items:</strong> {data.items}</p>
                  <p className="text-gray-700"><strong>Start:</strong> {data.startTime}</p>
                  <p className="text-gray-700"><strong>End:</strong> {data.endTime}</p>
                </div>
              ))}
            </div>

            <div className="mt-10">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-semibold text-indigo-700">Student Reviews</h2>
                <div className="text-sm text-gray-600">Avg: <span className="font-bold">{averageRating}</span> / 5 • {reviewCount} review{reviewCount === 1 ? '' : 's'}</div>
              </div>

              {Student ? (
                <form onSubmit={handleSubmitReview} className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center gap-2">
                      <label className="mr-2 font-medium">Your Rating</label>
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
                        <button type="button" onClick={() => setMyRating(0)} className="text-xs text-gray-500 underline ml-2">Clear</button>
                      )}
                    </div>
                    <input
                      type="text"
                      className="flex-1 border rounded px-3 py-2"
                      placeholder="Write a short review (optional)"
                      value={myComment}
                      onChange={(e) => setMyComment(e.target.value)}
                    />
                    <button
                      type="submit"
                      disabled={saving || !myRating}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                    >
                      {myRating ? 'Save Review' : 'Select Rating'}
                    </button>
                    {reviews.find(r => r?.student?.email === (Student?.email || "")) && (
                      <button
                        type="button"
                        onClick={handleDeleteReview}
                        disabled={saving}
                        className="bg-red-500 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                </form>
              ) : (
                <div className="text-sm text-gray-600 mb-4">Login as student to add a review.</div>
              )}

              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <div className="text-gray-600">No reviews yet.</div>
                ) : (
                  reviews.map((r) => (
                    <div key={r._id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="font-medium text-gray-800 break-words">{r?.student? `${r.student.name || 'Student'} (${r.student.email || 'No Email'})`: 'Unknown Student'}</div>
                        <div className="text-sm text-indigo-700 font-semibold">{r.rating} / 5</div>
                      </div>
                      {r.comment ? (
                        <div className="text-gray-700 mt-2 break-words">{r.comment}</div>
                      ) : null}
                      <div className="text-xs text-gray-400 mt-1">{new Date(r.createdAt).toLocaleString()}</div>
                    </div>
                  ))
                )}
              </div>

              {hasMore && (
                <div className="mt-4 flex justify-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loadingMore}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md disabled:opacity-50 w-full sm:w-auto"
                  >
                    {loadingMore ? 'Loading...' : 'Load More'}
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
