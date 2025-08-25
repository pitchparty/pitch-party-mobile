import { BookingItem } from "./types";

export const sample_bookings: BookingItem[] = [
    {
      id: 'B-7842',
      user: {
        id: 'U-123',
        name: 'John Smith',
        phone: '+1 (212) 555-7890',
        email: 'john.smith@example.com'
      },
      venue: {
        id: 'V-001',
        name: 'The Goal Post',
        location: 'Downtown, NYC'
      },
      event: 'UEFA Champions League Final',
      date: new Date(2025, 3, 15, 19, 30),
      status: 'confirmed',
      partySize: 8,
      specialRequests: 'Table near the main screen',
      paymentStatus: 'paid',
      amount: 240
    },
    {
      id: 'B-7843',
      user: {
        id: 'U-456',
        name: 'Sarah Johnson',
        phone: '+1 (415) 555-1234',
        email: 'sarah.j@example.com'
      },
      venue: {
        id: 'V-004',
        name: 'Overtime Bar',
        location: 'Marina, San Francisco'
      },
      event: 'NBA Playoffs Game 7',
      date: new Date(2025, 3, 16, 18, 0),
      status: 'pending',
      partySize: 4,
      specialRequests: 'Booth reservation if possible',
      paymentStatus: 'pending',
      amount: 120
    },
    {
      id: 'B-7844',
      user: {
        id: 'U-789',
        name: 'Michael Wilson',
        phone: '+1 (312) 555-6789',
        email: 'mwilson@example.com'
      },
      venue: {
        id: 'V-002',
        name: 'Champions Corner',
        location: 'Midtown, Chicago'
      },
      event: 'NFL Sunday - Bears vs. Packers',
      date: new Date(2025, 3, 18, 13, 0),
      status: 'confirmed',
      partySize: 12,
      specialRequests: 'Premium seating area',
      paymentStatus: 'paid',
      amount: 360
    },
    {
      id: 'B-7845',
      user: {
        id: 'U-234',
        name: 'Jessica Lee',
        phone: '+1 (305) 555-4321',
        email: 'jlee@example.com'
      },
      venue: {
        id: 'V-003',
        name: 'Premier Lounge',
        location: 'South Beach, Miami'
      },
      event: 'Formula 1 Miami Grand Prix',
      date: new Date(2025, 3, 20, 15, 0),
      status: 'pending',
      partySize: 6,
      specialRequests: null,
      paymentStatus: 'pending',
      amount: 180
    },
    {
      id: 'B-7846',
      user: {
        id: 'U-567',
        name: 'David Chen',
        phone: '+1 (617) 555-9876',
        email: 'dchen@example.com'
      },
      venue: {
        id: 'V-001',
        name: 'The Goal Post',
        location: 'Downtown, NYC'
      },
      event: 'Premier League - Man City vs. Liverpool',
      date: new Date(2025, 3, 22, 10, 0),
      status: 'confirmed',
      partySize: 4,
      specialRequests: 'Early entry for pre-game',
      paymentStatus: 'paid',
      amount: 120
    }
  ];