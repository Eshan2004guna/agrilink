import axios from 'axios';

// Base Axios instance ready for Spring Boot backend integration at /api
export const apiClient = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For Session/Cookie authentication
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized access - redirecting to login');
    }
    return Promise.reject(error);
  }
);
