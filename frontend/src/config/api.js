// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const API_ENDPOINTS = {
  // Auth endpoints
  USER_REGISTER: `${API_BASE_URL}/api/auth/user/register`,
  USER_LOGIN: `${API_BASE_URL}/api/auth/user/login`,
  FOOD_PARTNER_REGISTER: `${API_BASE_URL}/api/auth/foodpartner/register`,
  FOOD_PARTNER_LOGIN: `${API_BASE_URL}/api/auth/foodpartner/login`,
  
  // Food endpoints
  FOOD_ITEMS: `${API_BASE_URL}/api/food`,
  FOOD_LIKE: `${API_BASE_URL}/api/food/like`,
  FOOD_SAVE: `${API_BASE_URL}/api/food/save`,
  FOOD_LIKED: `${API_BASE_URL}/api/food/liked`,
  FOOD_SAVED: `${API_BASE_URL}/api/food/saved`,
  FOOD_COMMENTS: `${API_BASE_URL}/api/food/comments`,
  
  // Food Partner endpoints
  FOOD_PARTNER_AUTH_CHECK: `${API_BASE_URL}/api/foodpartner/auth/check`,
  FOOD_PARTNER_PROFILE: (partnerId) => `${API_BASE_URL}/api/foodpartner/${partnerId}`,
  FOOD_COMMENTS_BY_ID: (videoId) => `${API_BASE_URL}/api/food/comments/${videoId}`,
};

export default API_BASE_URL;