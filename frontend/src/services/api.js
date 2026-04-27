import axios from 'axios';

const BASE_URL = 'http://10.169.109.210:8080';

// Attach JWT token to every request if present
axios.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('hotel_user') || 'null');
  if (user?.token) config.headers.Authorization = `Bearer ${user.token}`;
  return config;
});

export const register = (data) => axios.post(`${BASE_URL}/auth/register`, data);
export const login = (data) => axios.post(`${BASE_URL}/auth/login`, data);

export const searchHotels = (location, minPrice, maxPrice, minRating, amenity, checkIn, checkOut) => {
  const params = { location };
  if (minPrice)  params.minPrice  = minPrice;
  if (maxPrice)  params.maxPrice  = maxPrice;
  if (minRating) params.minRating = minRating;
  if (amenity)   params.amenity   = amenity;
  if (checkIn)   params.checkIn   = checkIn;
  if (checkOut)  params.checkOut  = checkOut;
  return axios.get(`${BASE_URL}/hotels/search`, { params });
};

export const getRooms = (hotelId, checkIn, checkOut) => {
  const params = {};
  if (checkIn) params.checkIn = checkIn;
  if (checkOut) params.checkOut = checkOut;
  return axios.get(`${BASE_URL}/rooms/hotel/${hotelId}`, { params });
};

export const getRoomSummary = (hotelId, checkIn, checkOut) => {
  const params = {};
  if (checkIn) params.checkIn = checkIn;
  if (checkOut) params.checkOut = checkOut;
  return axios.get(`${BASE_URL}/rooms/hotel/${hotelId}/summary`, { params });
};

export const createBooking = (data) =>
  axios.post(`${BASE_URL}/bookings`, data);

export const getBookingHistory = () =>
  axios.get(`${BASE_URL}/bookings/history`);

export const cancelBooking = (bookingId) =>
  axios.delete(`${BASE_URL}/bookings/${bookingId}/cancel`);

export const rebook = (bookingId, data) =>
  axios.post(`${BASE_URL}/bookings/rebook/${bookingId}`, data);

export const getActivePromotions = () =>
  axios.get(`${BASE_URL}/promotions/active`);

export const getEligiblePromotions = () =>
  axios.get(`${BASE_URL}/promotions/eligible`);
