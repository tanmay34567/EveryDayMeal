import axios from 'axios';

// Create a simple axios instance with no baseURL
const api = axios.create({
  baseURL: '',  // No baseURL, we'll use full URLs
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add an interceptor to include the auth token in requests
api.interceptors.request.use(config => {
  // Check for vendor token first, then student token
  const vendorData = localStorage.getItem('currentVendor');
  const studentData = localStorage.getItem('currentStudent');
  
  let token = null;
  
  if (vendorData) {
    const vendor = JSON.parse(vendorData);
    token = vendor.token;
  } else if (studentData) {
    const student = JSON.parse(studentData);
    token = student.token;
  }
  
  // If token exists, add it to the Authorization header
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
});

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
