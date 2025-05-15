import axios from 'axios';

// Create a simple axios instance with no baseURL
const api = axios.create({
  baseURL: '',  // No baseURL, we'll use full URLs
  withCredentials: true,  // Still send cookies when possible
  headers: {
    'Content-Type': 'application/json',
  },
});

// Helper function to get auth token from localStorage
const getAuthToken = () => {
  try {
    // Check for vendor token first, then student token
    const vendorData = localStorage.getItem('currentVendor');
    const studentData = localStorage.getItem('currentStudent');
    
    if (vendorData) {
      const vendor = JSON.parse(vendorData);
      return vendor.token;
    } 
    
    if (studentData) {
      const student = JSON.parse(studentData);
      return student.token;
    }
    
    return null;
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Add a request interceptor to include the auth token in requests
api.interceptors.request.use(
  config => {
    // Get token from localStorage
    const token = getAuthToken();
    
    // If token exists, add it to the Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Adding auth token to request:', config.url);
    } else {
      console.log('No auth token available for request:', config.url);
    }
    
    return config;
  },
  error => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Get the base URL from environment or default
const getFullUrl = (endpoint) => {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
  return `${baseUrl}/api${endpoint}`;
};

// Export the getFullUrl function for use in service files
export { getFullUrl };

// Log requests in development environment
if (import.meta.env.DEV) {
  api.interceptors.request.use(request => {
    console.log('Full Request URL:', request.url);
    return request;
  });

  api.interceptors.response.use(response => {
    console.log('Response:', response);
    return response;
  }, error => {
    console.error('Response Error:', error);
    return Promise.reject(error);
  });
}

// Add response interceptor for handling errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle common errors (401, 403, etc.)
    if (error.response) {
      const { status } = error.response;
      
      if (status === 401) {
        // Handle unauthorized access
        console.error('Unauthorized access');
        // You could redirect to login page or dispatch a logout action
      }
      
      if (status === 403) {
        // Handle forbidden access
        console.error('Forbidden access');
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;
