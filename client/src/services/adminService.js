import api from './api';

const adminService = {
  // Get dashboard statistics
  getStats: async () => {
    try {
      const response = await api.get('/api/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching stats:', error);
      throw error;
    }
  },

  // Get all applications
  getAllApplications: async (status = '') => {
    try {
      const url = status ? `/api/admin/applications?status=${status}` : '/api/admin/applications';
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching applications:', error);
      throw error;
    }
  },

  // Get single application
  getApplicationById: async (applicationId) => {
    try {
      const response = await api.get(`/api/admin/applications/${applicationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching application:', error);
      throw error;
    }
  },

  // Approve application
  approveApplication: async (applicationId) => {
    try {
      const response = await api.post(`/api/admin/applications/${applicationId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  },

  // Reject application
  rejectApplication: async (applicationId, reason = '') => {
    try {
      const response = await api.post(`/api/admin/applications/${applicationId}/reject`, {
        reason
      });
      return response.data;
    } catch (error) {
      console.error('Error rejecting application:', error);
      throw error;
    }
  }
};

export default adminService;
