import { create } from 'zustand';
import { format } from 'date-fns';
import { Venue, VenueStream, SportEvent } from '../types';

interface VenueStreamState {
  venues: Venue[];
  venueStreams: Record<string, VenueStream[]>;
  availableSportEvents: SportEvent[];
  selectedVenue: Venue | null;
  isLoading: boolean;
  error: string | null;
  
  fetchVenues: () => Promise<void>;
  fetchVenueStreams: (venueId: string) => Promise<void>;
  fetchAvailableSportEvents: () => Promise<void>;
  selectVenue: (venue: Venue) => void;
  addStreamToVenue: (venueId: string, sportEvent: SportEvent) => Promise<void>;
}

export const useVenueStreamStore = create<VenueStreamState>((set, get) => ({
  venues: [],
  venueStreams: {},
  availableSportEvents: [],
  selectedVenue: null,
  isLoading: false,
  error: null,
  
  fetchVenues: async () => {
    try {
      set({ isLoading: true, error: null });
      // Fetch venues from Supabase
      // const { data, error } = await supabase.from('venues').select('*').eq('manager_id', currentUser.id);
      
      // Mock data for demonstration
      const data = [
        { id: '1', name: 'Sports Bar Downtown', address: '123 Main St', isApproved: true, isActive: true, status: 'published', averageRating: 4.5, capacity: 150 },
        { id: '2', name: 'Stadium View Pub', address: '456 Stadium Ave', isApproved: true, isActive: true, status: 'published', averageRating: 4.2, capacity: 200 },
        { id: '3', name: 'The Fan Zone', address: '789 Sports Blvd', isApproved: true, isActive: true, status: 'published', averageRating: 4.7, capacity: 120 },
      ];
      
      set({ venues: data as Venue[], isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  fetchVenueStreams: async (venueId: string) => {
    try {
      set({ isLoading: true, error: null });
      // Fetch venue streams from Supabase
      // const { data, error } = await supabase.from('venue_streams').select('*').eq('venue_id', venueId);
      
      // Mock data for demonstration
      const mockStreams = [
        { 
          id: '101', 
          venueId: '1', 
          eventId: 'e1', 
          eventName: 'Liverpool vs Manchester United', 
          streamDate: new Date('2025-05-15T19:00:00Z'),
          leagueName: 'Premier League',
          homeTeam: 'Liverpool',
          awayTeam: 'Manchester United',
          eventStatus: 'scheduled' as const,
          isActive: true,
          bookingsCount: 45,
          attendeesCount: 0,
          totalRevenue: 0
        },
        { 
          id: '102', 
          venueId: '1', 
          eventId: 'e2', 
          eventName: 'Lakers vs Celtics', 
          streamDate: new Date('2025-05-14T20:30:00Z'),
          leagueName: 'NBA',
          homeTeam: 'Lakers',
          awayTeam: 'Celtics',
          eventStatus: 'scheduled' as const,
          isActive: true,
          bookingsCount: 28,
          attendeesCount: 0,
          totalRevenue: 0
        },
      ];
      
      const venueStreams = { ...get().venueStreams };
      venueStreams[venueId] = mockStreams.filter(stream => stream.venueId === venueId);
      
      set({ venueStreams, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  fetchAvailableSportEvents: async () => {
    try {
      set({ isLoading: true, error: null });
      // In a real app, you'd fetch from TheSportsDB API
      // const response = await fetch(`https://www.thesportsdb.com/api/v1/json/YOUR_API_KEY/eventsday.php?d=${format(new Date(), 'yyyy-MM-dd')}&s=Soccer`);
      // const data = await response.json();
      
      // Mock data for demonstration
      const mockEvents: SportEvent[] = [
        {
          idEvent: 'e3',
          strEvent: 'Arsenal vs Chelsea',
          strTimestamp: '2025-05-18T15:00:00',
          strLeague: 'Premier League',
          strHomeTeam: 'Arsenal',
          strAwayTeam: 'Chelsea',
          strThumb: 'https://example.com/arsenal-chelsea.jpg'
        },
        {
          idEvent: 'e4',
          strEvent: 'Barcelona vs Real Madrid',
          strTimestamp: '2025-05-20T19:00:00',
          strLeague: 'La Liga',
          strHomeTeam: 'Barcelona',
          strAwayTeam: 'Real Madrid',
          strThumb: 'https://example.com/barca-madrid.jpg'
        },
        {
          idEvent: 'e5',
          strEvent: 'Warriors vs Suns',
          strTimestamp: '2025-05-17T22:00:00',
          strLeague: 'NBA',
          strHomeTeam: 'Warriors',
          strAwayTeam: 'Suns',
          strThumb: 'https://example.com/warriors-suns.jpg'
        }
      ];
      
      set({ availableSportEvents: mockEvents, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  },
  
  selectVenue: (venue: Venue) => {
    set({ selectedVenue: venue });
  },
  
  addStreamToVenue: async (venueId: string, sportEvent: SportEvent) => {
    try {
      set({ isLoading: true, error: null });
      
      // Create new venue stream object
      const newStream: VenueStream = {
        id: `new-${Date.now()}`, // This would be generated by Supabase
        venueId,
        eventId: sportEvent.idEvent,
        eventName: sportEvent.strEvent,
        streamDate: new Date(sportEvent.strTimestamp),
        leagueName: sportEvent.strLeague,
        homeTeam: sportEvent.strHomeTeam,
        awayTeam: sportEvent.strAwayTeam,
        eventStatus: 'scheduled',
        isActive: true,
        bookingsCount: 0,
        attendeesCount: 0,
        totalRevenue: 0
      };
      
      // In a real app, you'd insert into Supabase
      // const { data, error } = await supabase.from('venue_streams').insert(newStream);
      
      // Update local state
      const venueStreams = { ...get().venueStreams };
      venueStreams[venueId] = [...(venueStreams[venueId] || []), newStream];
      
      set({ venueStreams, isLoading: false });
    } catch (error) {
      set({ error: (error as Error).message, isLoading: false });
    }
  }
}));