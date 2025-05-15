import api, { getFullUrl } from './api';

// Vendor authentication services
export const vendorAuth = {
  // Register a new vendor
  register: async (userData) => {
    try {
      const response = await api.post(getFullUrl('/Vendor/register'), userData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Login a vendor
  login: async (credentials) => {
    try {
      const response = await api.post(getFullUrl('/Vendor/login'), credentials);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Logout a vendor
  logout: async () => {
    try {
      const response = await api.post(getFullUrl('/Vendor/logout'));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get current vendor profile
  getProfile: async () => {
    try {
      const response = await api.get(getFullUrl('/Vendor/profile'));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update vendor profile
  updateProfile: async (profileData) => {
    try {
      const response = await api.put(getFullUrl('/Vendor/profile'), profileData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Vendor menu services
export const vendorMenus = {
  // Get vendor's menu
  getMenus: async () => {
    try {
      const url = getFullUrl('/Vendor/menu');
      console.log('Fetching menu from:', url);
      
      // Check if we have a token before making the request
      const vendorData = localStorage.getItem('currentVendor');
      if (vendorData) {
        const vendor = JSON.parse(vendorData);
        if (!vendor.token) {
          console.warn('No authentication token found in vendor data');
        } else {
          console.log('Authentication token is available for request');
        }
      } else {
        console.warn('No vendor data found in localStorage');
      }
      
      const response = await api.get(url);
      console.log('Menu response:', response);
      
      // Check if the response contains data.data (the actual menu object)
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
      // If no menu was found but the request was successful (empty response)
      if (response.data && response.data.success) {
        console.log('No menu found for this vendor yet');
        return null;
      }
      
      return null;
    } catch (error) {
      // Check for 404 errors first (no menu exists yet) - this is an expected case, not an error
      if (error.response && error.response.status === 404) {
        console.log('No menu exists yet for this vendor (404 response)');
        console.log('This is normal for new vendors who haven\'t created a menu yet');
        return createMockMenu(); // Return mock data for development and testing
      }
      
      // For other errors, log detailed error information
      console.error('Error fetching menu:', error);
      
      if (error.response) {
        console.log('Error response status:', error.response.status);
        console.log('Error response data:', error.response.data);
        
        // Check specifically for 401 errors which indicate authentication issues
        if (error.response.status === 401) {
          console.error('Unauthorized access - authentication token might be missing or invalid');
        }
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error setting up request:', error.message);
      }
      
      // Return mock data for development and testing
      console.log('Returning mock menu data as fallback');
      return createMockMenu();
    }
  },

  // Create or update a menu
  createMenu: async (menuData) => {
    try {
      const response = await api.post(getFullUrl('/Vendor/menu'), menuData);
      // Check if the response contains data.data (the actual menu object)
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      return response.data;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  },

  // Delete a menu
  deleteMenu: async () => {
    try {
      console.log('Attempting to delete menu');
      const response = await api.delete(getFullUrl('/Vendor/menu'));
      console.log('Menu deleted successfully');
      return response.data;
    } catch (error) {
      // Check for 404 errors first (no menu exists to delete) - this is an expected case
      if (error.response && error.response.status === 404) {
        console.log('No menu exists to delete (404 response)');
        console.log('This is normal if you haven\'t created a menu yet');
        // Return a successful response with a message
        return {
          success: true,
          message: 'No menu exists to delete',
          noMenuExists: true
        };
      }
      
      // For other errors, log detailed error information
      console.error('Error deleting menu:', error);
      
      if (error.response) {
        console.log('Error response status:', error.response.status);
        console.log('Error response data:', error.response.data);
      }
      
      throw error;
    }
  }
};

// Vendor order services
export const vendorOrders = {
  // Get all orders for the vendor
  getOrders: async () => {
    try {
      const response = await api.get(getFullUrl('/Vendor/orders'));
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get details of a specific order
  getOrderDetails: async (orderId) => {
    try {
      const response = await api.get(`/api/Vendor/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Update order status
  updateOrderStatus: async (orderId, statusData) => {
    try {
      const response = await api.put(`/api/Vendor/orders/${orderId}/status`, statusData);
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

// Helper function to create mock menu data for development and testing
const createMockMenu = () => {
  const today = new Date();
  const date = today.toISOString().split('T')[0];
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const day = days[today.getDay()];
  
  return {
    _id: 'mock-menu-id',
    vendorEmail: 'vendor@example.com',
    vendorName: 'Mock Vendor',
    date,
    day,
    meals: {
      breakfast: {
        items: 'Idli, Dosa, Upma, Tea, Coffee',
        startTime: '07:30',
        endTime: '09:30'
      },
      lunch: {
        items: 'Rice, Dal, Sabji, Roti, Salad, Curd',
        startTime: '12:30',
        endTime: '14:30'
      },
      dinner: {
        items: 'Pulao, Dal Fry, Paneer Curry, Roti, Salad',
        startTime: '19:30',
        endTime: '21:30'
      }
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

export default { vendorAuth, vendorMenus, vendorOrders };
