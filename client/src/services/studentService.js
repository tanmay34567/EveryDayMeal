import api, { getFullUrl } from './api';

// Initialize auth token from localStorage if available
const initializeAuthToken = () => {
  try {
    const studentData = localStorage.getItem('currentStudent');
    if (studentData) {
      const { token } = JSON.parse(studentData);
      if (token) {
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        return true;
      }
    }
  } catch (error) {
    console.error('Error initializing auth token:', error);
  }
  return false;
};

// Initialize auth token when the service is loaded
initializeAuthToken();

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

  // Send email OTP to student
  sendEmailOtp: async (email) => {
    try {
      const response = await api.post(getFullUrl('/Student/otp/send'), { email });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Verify email OTP for student login
  verifyEmailOtp: async (email, otp) => {
    try {
      console.log('Verifying OTP for email:', email);
      const response = await api.post(getFullUrl('/Student/otp/verify'), { email, otp });
      console.log('OTP verification response:', response.data);
      
      // If verification is successful, ensure we have the token
      if (response.data && response.data.success && response.data.data) {
        const { token, student } = response.data.data;
        
        // Store the student data with token in localStorage
        if (token && student) {
          const studentData = { ...student, token };
          console.log('Storing student data in localStorage:', { email: studentData.email, hasToken: !!token });
          localStorage.setItem('currentStudent', JSON.stringify(studentData));
          
          // Update the axios default headers
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          console.log('Set Authorization header for future requests');
          
          // Return the complete student data with token
          return { ...response.data, student: studentData };
        } else {
          console.warn('Token or student data missing in OTP verification response');
        }
      }
      
      return response.data;
    } catch (error) {
      console.error('Error verifying OTP:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        console.error('Error status:', error.response.status);
      }
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
      // Ensure we have the latest token from localStorage
      const studentData = localStorage.getItem('currentStudent');
      let token = null;
      
      if (studentData) {
        try {
          const student = JSON.parse(studentData);
          token = student?.token;
          
          if (!token) {
            console.warn('No authentication token found in student data');
          } else {
            console.log('Using stored token for vendors request');
            // Ensure axios has the latest token
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          }
        } catch (e) {
          console.error('Error parsing student data from localStorage:', e);
        }
      } else {
        console.warn('No student data found in localStorage');
      }
      
      // Log the current Authorization header for debugging
      console.log('Current Authorization header:', api.defaults.headers.common['Authorization'] ? 'Present' : 'Missing');
      
      console.log('Fetching available vendors from:', getFullUrl('/Student/vendors'));
      const response = await api.get(getFullUrl('/Student/vendors'));
      
      console.log('Vendors API response:', response.data);
      if (response.data && response.data.success) {
        return response.data.data || [];
      }
      
      return [];
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        console.log(`Error status: ${error.response.status}`);
        console.log('Error response:', error.response.data);
        
        // 401 means unauthorized - likely authentication issue
        if (error.response.status === 401) {
          console.error('Unauthorized access - authentication token might be missing or invalid');
        }
      } else {
        console.error('Error fetching available vendors:', error);
      }
      
      // Return an empty array to indicate no vendors are available
      console.log('No vendors available or error fetching vendors. Returning empty array.');
      return [];
    }
  },

  // Get menu by vendor email
  getVendorMenu: async (vendorEmail) => {
    try {
      // Check if vendorEmail is provided
      if (!vendorEmail) {
        console.error('No vendor email provided');
        return null;
      }
      
      console.log('Fetching menu for vendor:', vendorEmail);
      const response = await api.get(getFullUrl(`/Vendor/menu/${vendorEmail}`));
      console.log('Vendor menu API response:', response.data);
      
      if (response.data && response.data.success && response.data.data) {
        return response.data.data;
      }
      
      console.log('No menu data found for vendor:', vendorEmail);
      return null;
    } catch (error) {
      // Handle specific error cases
      if (error.response) {
        console.log(`Error status: ${error.response.status}`);
        console.log('Error response:', error.response.data);
        
        // 404 means no menu exists - this is an expected case
        if (error.response.status === 404) {
          console.log(`No menu found for vendor: ${vendorEmail}`);
        }
      } else {
        console.error('Error fetching vendor menu:', error);
      }
      
      // Return null to indicate no menu exists
      console.log('No menu exists for this vendor. Returning null.');
      return null;
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

// Student reviews services
export const studentReviews = {
  // List reviews and average for a vendor
  getByVendor: async (vendorEmail, { page = 1, limit = 10 } = {}) => {
    const response = await api.get(getFullUrl(`/Student/reviews/${vendorEmail}?page=${page}&limit=${limit}`));
    return response.data;
  },
  // Create or update own review for a vendor
  upsert: async (vendorEmail, { rating, comment, vendorName }) => {
    const response = await api.post(getFullUrl(`/Student/reviews/${vendorEmail}`), { rating, comment, vendorName });
    return response.data;
  },
  // Delete own review for a vendor
  remove: async (vendorEmail) => {
    const response = await api.delete(getFullUrl(`/Student/reviews/${vendorEmail}`));
    return response.data;
  }
};

export default { studentAuth, studentMeals, studentReviews };
