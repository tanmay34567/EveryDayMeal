import api, { getFullUrl } from './api';

// Contact services
const contactService = {
  // Send a contact form message
  sendMessage: async (contactData) => {
    try {
      const response = await api.post(getFullUrl('/contact'), contactData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get all contact messages (admin only)
  getMessages: async () => {
    try {
      const response = await api.get(getFullUrl('/contact'));
      return response.data;
    } catch (error) {
      throw error;
    }
  }
};

export default contactService;
