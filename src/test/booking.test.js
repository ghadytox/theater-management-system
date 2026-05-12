import { describe, it, expect, beforeEach } from 'vitest';
import { generateSeats } from '../data/mockData';

// Test the reducer logic directly
const initialState = {
  shows: [{ id: 1, title: 'Test Show', price: 20 }],
  seats: {},
  bookings: [],
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_SEATS':
      if (state.seats[action.showId]) return state;
      return { ...state, seats: { ...state.seats, [action.showId]: generateSeats(action.showId) } };
    case 'BOOK_SEAT': {
      const { showId, seatId, customerName, customerEmail } = action;
      const alreadyBooked = state.bookings.find((b) => b.showId === showId && b.seatId === seatId);
      if (alreadyBooked) return state;
      const updatedSeats = (state.seats[showId] || []).map((s) =>
        s.id === seatId ? { ...s, status: 'booked' } : s
      );
      return {
        ...state,
        seats: { ...state.seats, [showId]: updatedSeats },
        bookings: [...state.bookings, { id: 1, showId, seatId, customerName, customerEmail, status: 'confirmed' }],
      };
    }
    case 'ADD_SHOW':
      return { ...state, shows: [...state.shows, action.show] };
    case 'DELETE_SHOW':
      return { ...state, shows: state.shows.filter((s) => s.id !== action.id) };
    default:
      return state;
  }
}

describe('TC-01: generateSeats', () => {
  it('generates 40 seats for a show (5 rows x 8)', () => {
    const seats = generateSeats(1);
    expect(seats).toHaveLength(40);
  });

  it('all seats have valid status', () => {
    const seats = generateSeats(1);
    seats.forEach((s) => expect(['available', 'booked']).toContain(s.status));
  });
});

describe('TC-02: LOAD_SEATS', () => {
  it('loads seats for a show', () => {
    const state = reducer(initialState, { type: 'LOAD_SEATS', showId: 1 });
    expect(state.seats[1]).toHaveLength(40);
  });

  it('does not reload seats if already loaded', () => {
    const withSeats = reducer(initialState, { type: 'LOAD_SEATS', showId: 1 });
    const original = withSeats.seats[1];
    const again = reducer(withSeats, { type: 'LOAD_SEATS', showId: 1 });
    expect(again.seats[1]).toBe(original);
  });
});

describe('TC-03: BOOK_SEAT', () => {
  it('creates a confirmed booking', () => {
    let state = reducer(initialState, { type: 'LOAD_SEATS', showId: 1 });
    const seatId = state.seats[1][0].id;
    state = reducer(state, { type: 'BOOK_SEAT', showId: 1, seatId, customerName: 'Alice', customerEmail: 'alice@test.com' });
    expect(state.bookings).toHaveLength(1);
    expect(state.bookings[0].status).toBe('confirmed');
  });

  it('marks the seat as booked', () => {
    let state = reducer(initialState, { type: 'LOAD_SEATS', showId: 1 });
    const firstSeatId = state.seats[1][0].id;
    state = reducer(state, { type: 'BOOK_SEAT', showId: 1, seatId: firstSeatId, customerName: 'Bob', customerEmail: 'bob@test.com' });
    const seat = state.seats[1].find((s) => s.id === firstSeatId);
    expect(seat.status).toBe('booked');
  });
});

describe('TC-04: Double booking prevention', () => {
  it('does not allow booking the same seat twice', () => {
    let state = reducer(initialState, { type: 'LOAD_SEATS', showId: 1 });
    const seatId = state.seats[1][0].id;
    const action = { type: 'BOOK_SEAT', showId: 1, seatId, customerName: 'Alice', customerEmail: 'alice@test.com' };
    state = reducer(state, action);
    state = reducer(state, action);
    expect(state.bookings).toHaveLength(1);
  });
});

describe('TC-05: Admin show management', () => {
  it('adds a new show', () => {
    const state = reducer(initialState, { type: 'ADD_SHOW', show: { id: 99, title: 'New Show' } });
    expect(state.shows).toHaveLength(2);
    expect(state.shows[1].title).toBe('New Show');
  });

  it('deletes a show', () => {
    const state = reducer(initialState, { type: 'DELETE_SHOW', id: 1 });
    expect(state.shows).toHaveLength(0);
  });
});
