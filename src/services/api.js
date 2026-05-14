import axios from 'axios';

const api = axios.create({ baseURL: 'http://localhost:8081/api' });

export const getShows = () => api.get('/shows');
export const getShow = (id) => api.get(`/shows/${id}`);
export const createShow = (show) => api.post('/shows', show);
export const deleteShow = (id) => api.delete(`/shows/${id}`);

export const getSeats = (showId) => api.get(`/seats/${showId}`);

export const getBookings = () => api.get('/bookings');
export const createBooking = (booking) => api.post('/bookings', booking);
