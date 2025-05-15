import api, { getFullUrl } from './api';

// Student authentication services
export const studentAuth = {
  // Register a new student
  register: async (userData) => {
    try {
      const response = await api.post(getFullUrl('/Student/register'), userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login a student
  login: async (credentials) => {
    try {
      const response = await api.post(getFullUrl('/Student/login'), credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout a student
  logout: async () => {
    try {
      const response = await api.post(getFullUrl('/Student/logout'));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current student profile
  getProfile: async () => {
    try {
      const response = await api.get(getFullUrl('/Student/profile'));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update student profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(getFullUrl('/Student/profile'), profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Student meal services
export const studentMeals = {
  // Get all available vendors with menus
  getAvailableVendors: async () => {
    try {
      const response = await api.get(getFullUrl('/Student/vendors'));
      console.log('Vendors API response:', response.data);
      if (response.data && response.data.success) {
        return response.data.data || [];
      }
      return [];
    } catch (error) {
      console.error('Error fetching available vendors:', error);
      // For testing, return mock data if API fails
      console.log('Returning mock vendor data for testing');
      return [
        { name: 'Test Vendor 1', email: 'vendor1@test.com' },
        { name: 'Test Vendor 2', email: 'vendor2@test.com' }
      ];
    }
  },

  // Get menu by vendor email
  getVendorMenu: async (vendorEmail) => {
    try {
      const response = await api.get(getFullUrl(`/Vendor/menu/${vendorEmail}`));
      console.log('Vendor menu API response:', response.data);
      if (response.data && response.data.success) {
        return response.data.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching vendor menu:', error);
      // For testing, return mock menu data if API fails
      console.log('Returning mock menu data for testing');
      return {
        vendorEmail: vendorEmail,
        vendorName: 'Test Vendor',
        date: '2025-05-15',
        day: 'Thursday',
        meals: {
          breakfast: {
            items: 'Eggs, Toast, Juice',
            startTime: '7:00 AM',
            endTime: '9:00 AM'
          },
          lunch: {
            items: 'Sandwich, Salad, Fruit',
            startTime: '12:00 PM',
            endTime: '2:00 PM'
          },
          dinner: {
            items: 'Pasta, Garlic Bread, Dessert',
            startTime: '6:00 PM',
            endTime: '8:00 PM'
          }
        }
      };
    }
  },

  // Get available menus
  getMenus: async () => {
    try {
      const response = await api.get(getFullUrl('/Student/menus'));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Place an order
  placeOrder: async (orderData) => {
    try {
      const response = await api.post(getFullUrl('/Student/order'), orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get student's order history
  getOrderHistory: async () => {
    try {
      const response = await api.get(getFullUrl('/Student/orders'));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get details of a specific order
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/api/Student/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default { studentAuth, studentMeals };
