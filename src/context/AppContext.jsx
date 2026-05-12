// Observer Pattern implementation:
// AppContext acts as the Subject. Every component that calls useApp()
// is an Observer — they automatically re-render when state changes.
import { createContext, useContext, useReducer } from 'react';
import { initialShows, generateSeats } from '../data/mockData';

const AppContext = createContext(null);

const initialState = {
  shows: initialShows,
  seats: {},       // { [showId]: seat[] }
  bookings: [],
  currentUser: { id: 1, name: 'Guest', role: 'customer' },
};

// Pure reducer function — handles all state transitions predictably
function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_SEATS': {
      // Avoid regenerating seats if already loaded for this show
      if (state.seats[action.showId]) return state;
      return { ...state, seats: { ...state.seats, [action.showId]: generateSeats(action.showId) } };
    }
    case 'BOOK_SEAT': {
      const { showId, seatId, customerName, customerEmail } = action;
      const alreadyBooked = state.bookings.find(
        (b) => b.showId === showId && b.seatId === seatId
      );
      // Prevent double-booking the same seat
      if (alreadyBooked) return state;
      const updatedSeats = state.seats[showId].map((s) =>
        s.id === seatId ? { ...s, status: 'booked' } : s
      );
      const booking = {
        id: Date.now(),
        showId,
        seatId,
        customerName,
        customerEmail,
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
      };
      return {
        ...state,
        seats: { ...state.seats, [showId]: updatedSeats },
        bookings: [...state.bookings, booking],
      };
    }
    case 'ADD_SHOW':
      return { ...state, shows: [...state.shows, { ...action.show, id: Date.now() }] };
    case 'DELETE_SHOW':
      return { ...state, shows: state.shows.filter((s) => s.id !== action.id) };
    case 'SET_USER':
      return { ...state, currentUser: action.user };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  return <AppContext.Provider value={{ state, dispatch }}>{children}</AppContext.Provider>;
}

export const useApp = () => useContext(AppContext);
