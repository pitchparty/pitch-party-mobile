import { EplEvent } from '@/features/premierLeague/types/event';
import { VenueWithManager } from '@/features/venues/types';
import { create } from 'zustand';

interface BookingStore {
    selectedMatch: EplEvent | undefined;
    selectedVenue: VenueWithManager | undefined;
    ticketCount: number;
    setSelectedMatch: (match: EplEvent | undefined) => void;
    setSelectedVenue: (venue: VenueWithManager | undefined) => void;
    setTicketCount: (count: number) => void;
}

export const useBookingStore = create<BookingStore>((set) => ({
    selectedMatch: undefined,
    selectedVenue: undefined,
    ticketCount: 1,
    setSelectedMatch: (match) => set({ selectedMatch: match }),
    setSelectedVenue: (venue) => set({ selectedVenue: venue }),
    setTicketCount: (count) => set({ ticketCount: count }),
  }))