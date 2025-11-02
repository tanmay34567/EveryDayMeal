import api from './api';

export const vendorApplicationService = {
  apply: async (data) => {
    try {
      const response = await api.post('/vendor/apply', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },
};
