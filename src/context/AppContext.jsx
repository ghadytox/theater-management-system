// Observer Pattern: AppContext is the Subject, all consuming components are Observers
import { createContext, useContext, useReducer, useEffect } from 'react';
import { getShows, getBookings } from '../services/api';

const AppContext = createContext(null);

const initialState = {
  shows: [],
  seats: {},
  bookings: [],
  currentUser: { id: 1, name: 'Guest', role: 'customer' },
  loading: true,
};

function reducer(state, action) {
  switch (action.type) {
    case 'SET_SHOWS':
      return { ...state, shows: action.shows, loading: false };
    case 'SET_BOOKINGS':
      return { ...state, bookings: action.bookings };
    case 'SET_SEATS':
      return { ...state, seats: { ...state.seats, [action.showId]: action.seats } };
    case 'ADD_SHOW':
      return { ...state, shows: [...state.shows, action.show] };
    case 'DELETE_SHOW':
      return { ...state, shows: state.shows.filter((s) => s.id !== action.id) };
    case 'BOOK_SEAT': {
      // Update seat status locally after successful API call
      const updatedSeats = (state.seats[action.showId] || []).map((s) =>
        s.id === action.seatId ? { ...s, status: 'booked' } : s
      );
      return {
        ...state,
        seats: { ...state.seats, [action.showId]: updatedSeats },
        bookings: [...state.bookings, action.booking],
      };
    }
    case 'SET_USER':
      return { ...state, currentUser: action.user };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // Load shows and bookings from backend on startup
  useEffect(() => {
    getShows().then((res) => dispatch({ type: 'SET_SHOWS', shows: res.data }));
    getBookings().then((res) => dispatch({ type: 'SET_BOOKINGS', bookings: res.data }));
  }, []);

  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
