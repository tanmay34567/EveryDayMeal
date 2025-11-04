import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import adminService from '../services/adminService';
import { assets } from '../assets/assets';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pending: 0, approved: 0, rejected: 0, totalVendors: 0 });
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [selectedApp, setSelectedApp] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'approve' or 'reject'
  const [reason, setReason] = useState('');
  const [processing, setProcessing] = useState(false);

  // Check if user is admin
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentVendor') || '{}');
    if (!user.isAdmin) {
      alert('Access denied. Admin privileges required.');
      navigate('/');
      return;
    }
    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [statsData, appsData] = await Promise.all([
        adminService.getStats(),
        adminService.getAllApplications()
      ]);
      setStats(statsData.data);
      setApplications(appsData.data);
      filterApplications(appsData.data, filter);
    } catch (error) {
      console.error('Error fetching data:', error);
      alert('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterApplications = (apps, status) => {
    if (status === 'all') {
      setFilteredApplications(apps);
    } else {
      setFilteredApplications(apps.filter(app => app.status === status));
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    filterApplications(applications, newFilter);
  };

  const openModal = (app, type) => {
    setSelectedApp(app);
    setModalType(type);
    setShowModal(true);
    setReason('');
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApp(null);
    setReason('');
  };

  const handleApprove = async () => {
    if (!selectedApp) return;
    
    setProcessing(true);
    try {
      await adminService.approveApplication(selectedApp._id);
      alert(`Application approved! Vendor: ${selectedApp.name}\nThey can now login using OTP.`);
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error approving:', error);
      alert(error.response?.data?.message || 'Failed to approve application');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedApp) return;
    
    if (!reason.trim()) {
      alert('Please provide a reason for rejection');
      return;
    }

    setProcessing(true);
    try {
      await adminService.rejectApplication(selectedApp._id, reason);
      alert(`Application rejected and deleted: ${selectedApp.name}`);
      closeModal();
      fetchData();
    } catch (error) {
      console.error('Error rejecting:', error);
      alert(error.response?.data?.message || 'Failed to reject application');
    } finally {
      setProcessing(false);
    }
  };

  const viewDetails = (app) => {
    setSelectedApp(app);
    setModalType('view');
    setShowModal(true);
  };

  if (loading) {
    return (
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 z-[-1]">
          <img src={assets.bg} alt="Background" className="w-full h-full object-cover" />
        </div>
        <div className="text-center bg-white/90 backdrop-blur-sm rounded-2xl p-8 shadow-2xl">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-700 font-semibold">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full min-h-screen overflow-hidden">
      {/* Background with Image */}
      <div className="fixed inset-0 z-[-1]">
        <img src={assets.bg} alt="Background" className="w-full h-full object-cover" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 lg:px-20 py-6 sm:py-12">
        {/* Header */}
        <div className="mb-6 sm:mb-10 text-center animate-fade-up">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900">
            🛡️ Admin <span className="text-green-600">Dashboard</span>
          </h1>
          <p className="text-gray-700 mt-2 sm:mt-4 text-sm sm:text-base md:text-lg font-medium">Manage vendor applications efficiently</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-10">
          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Pending</p>
                <p className="text-2xl sm:text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="bg-yellow-100 p-2 sm:p-3 rounded-full">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Approved</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Rejected</p>
                <p className="text-2xl sm:text-3xl font-bold text-red-600">{stats.rejected}</p>
              </div>
              <div className="bg-red-100 p-2 sm:p-3 rounded-full">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 p-3 sm:p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs sm:text-sm text-gray-600">Total Vendors</p>
                <p className="text-2xl sm:text-3xl font-bold text-green-600">{stats.totalVendors}</p>
              </div>
              <div className="bg-green-100 p-2 sm:p-3 rounded-full">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white/95 backdrop-blur-sm rounded-xl sm:rounded-2xl shadow-lg mb-6 sm:mb-8 overflow-hidden border border-gray-200">
          <div className="flex overflow-x-auto border-b border-gray-200">
            {['pending', 'approved', 'rejected', 'all'].map((tab) => (
              <button
                key={tab}
                onClick={() => handleFilterChange(tab)}
                className={`px-4 sm:px-6 py-2 sm:py-3 text-sm font-medium capitalize transition-all whitespace-nowrap ${
                  filter === tab
                    ? 'border-b-2 border-green-500 text-green-600 bg-green-50'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {tab} ({tab === 'all' ? applications.length : applications.filter(a => a.status === tab).length})
              </button>
            ))}
          </div>
        </div>

        {/* Applications Table - Desktop Only */}
        <div className="hidden lg:block bg-white/95 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden border border-gray-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vendor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mess Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApplications.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                      No applications found
                    </td>
                  </tr>
                ) : (
                  filteredApplications.map((app) => (
                    <tr key={app._id} className="hover:bg-green-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{app.name}</div>
                          <div className="text-sm text-gray-500">{app.email}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.contactNumber}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.messName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{app.city}, {app.pincode}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          app.status === 'approved' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {app.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <button
                          onClick={() => viewDetails(app)}
                          className="text-green-600 hover:text-green-900 font-semibold"
                        >
                          View
                        </button>
                        {app.status === 'pending' && (
                          <>
                            <button
                              onClick={() => openModal(app, 'approve')}
                              className="text-green-600 hover:text-green-900"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => openModal(app, 'reject')}
                              className="text-red-600 hover:text-red-900"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Applications Cards - Mobile & Tablet */}
        <div className="lg:hidden space-y-4">
          {filteredApplications.length === 0 ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-xl p-8 text-center text-gray-500 border border-gray-200">
              <div className="text-4xl mb-3">📄</div>
              <p className="font-medium">No applications found</p>
            </div>
          ) : (
            filteredApplications.map((app) => (
              <div key={app._id} className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-4 border-2 border-gray-200">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 min-w-0 pr-2">
                    <h3 className="text-base font-bold text-gray-900 break-words">{app.name}</h3>
                    <p className="text-xs text-gray-600 break-all">{app.email}</p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-bold rounded-full uppercase whitespace-nowrap ${
                    app.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    app.status === 'approved' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {app.status}
                  </span>
                </div>
                
                <div className="bg-gray-50 rounded-lg p-3 mb-3 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📞</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Contact</p>
                      <p className="text-sm text-gray-900 font-medium">{app.contactNumber}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">🏪</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Mess Name</p>
                      <p className="text-sm text-gray-900 font-medium break-words">{app.messName}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-lg">📍</span>
                    <div className="flex-1">
                      <p className="text-xs text-gray-500">Location</p>
                      <p className="text-sm text-gray-900 font-medium">{app.city}, {app.pincode}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => viewDetails(app)}
                    className="w-full bg-green-500 hover:bg-green-600 text-white text-sm font-bold py-2.5 px-4 rounded-lg transition-all"
                  >
                    View Details
                  </button>
                  {app.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openModal(app, 'approve')}
                        className="bg-green-100 hover:bg-green-200 text-green-700 text-sm font-bold py-2.5 px-3 rounded-lg transition-all border border-green-300"
                      >
                        ✅ Approve
                      </button>
                      <button
                        onClick={() => openModal(app, 'reject')}
                        className="bg-red-100 hover:bg-red-200 text-red-700 text-sm font-bold py-2.5 px-3 rounded-lg transition-all border border-red-300"
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && selectedApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 z-50">
          <div className="bg-white rounded-xl sm:rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="p-4 sm:p-6">
              <div className="flex justify-between items-center mb-3 sm:mb-4">
                <h2 className="text-lg sm:text-2xl font-bold text-gray-900">
                  {modalType === 'view' ? 'Application Details' :
                   modalType === 'approve' ? 'Approve Application' :
                   'Reject Application'}
                </h2>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Application Details */}
              <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Name</label>
                    <p className="text-sm sm:text-base text-gray-900 break-words">{selectedApp.name}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Email</label>
                    <p className="text-sm sm:text-base text-gray-900 break-all">{selectedApp.email}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Contact</label>
                    <p className="text-sm sm:text-base text-gray-900">{selectedApp.contactNumber}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Mess Name</label>
                    <p className="text-sm sm:text-base text-gray-900 break-words">{selectedApp.messName}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Address</label>
                    <p className="text-sm sm:text-base text-gray-900 break-words">{selectedApp.address}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">City</label>
                    <p className="text-sm sm:text-base text-gray-900">{selectedApp.city}</p>
                  </div>
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Pincode</label>
                    <p className="text-sm sm:text-base text-gray-900">{selectedApp.pincode}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs sm:text-sm font-medium text-gray-500">Verification Type</label>
                    <p className="text-sm sm:text-base text-gray-900 capitalize">{selectedApp.gstinOrImages}</p>
                  </div>
                  {selectedApp.gstinNumber && (
                    <div className="sm:col-span-2">
                      <label className="text-xs sm:text-sm font-medium text-gray-500">GSTIN Number</label>
                      <p className="text-sm sm:text-base text-gray-900">{selectedApp.gstinNumber}</p>
                    </div>
                  )}
                </div>

                {selectedApp.restaurantImages && selectedApp.restaurantImages.length > 0 && (
                  <div>
                    <label className="text-xs sm:text-sm font-medium text-gray-500 block mb-2">Restaurant Images</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {selectedApp.restaurantImages.map((img, idx) => (
                        <img key={idx} src={img} alt={`Restaurant ${idx + 1}`} className="w-full h-32 object-cover rounded" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Forms */}
              {modalType === 'approve' && (
                <div className="space-y-4">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-4 rounded-r-lg">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-green-700">
                          <strong>OTP-Based Login:</strong> The approved vendor will login using their email with OTP verification. No password is required.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={handleApprove}
                      disabled={processing}
                      className="flex-1 bg-green-600 text-white py-3 sm:py-2 px-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-all font-semibold text-sm sm:text-base"
                    >
                      {processing ? 'Processing...' : 'Approve & Send Email'}
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 sm:py-2 px-4 rounded-lg hover:bg-gray-400 transition-all font-semibold text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'reject' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Rejection Reason *
                    </label>
                    <textarea
                      value={reason}
                      onChange={(e) => setReason(e.target.value)}
                      placeholder="Provide a reason for rejection..."
                      rows="4"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={handleReject}
                      disabled={processing || !reason.trim()}
                      className="flex-1 bg-red-600 text-white py-3 sm:py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 transition-all font-semibold text-sm sm:text-base"
                    >
                      {processing ? 'Processing...' : 'Reject & Delete'}
                    </button>
                    <button
                      onClick={closeModal}
                      className="flex-1 bg-gray-300 text-gray-700 py-3 sm:py-2 px-4 rounded-lg hover:bg-gray-400 transition-all font-semibold text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {modalType === 'view' && (
                <button
                  onClick={closeModal}
                  className="w-full bg-green-500 text-white py-3 sm:py-2 px-4 rounded-lg hover:bg-green-600 transition-all font-semibold text-sm sm:text-base"
                >
                  Close
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
