export interface Venue {
    id: string;
    name: string;
    address: string;
    description?: string;
    averageRating?: number;
    pricing?: number;
    capacity?: number;
    isApproved: boolean;
    isActive: boolean;
    status: 'draft' | 'published' | 'archived';
  }
  
  export interface VenueStream {
    id: string;
    venueId: string;
    eventId: string;
    eventName: string;
    streamDate: Date;
    leagueName?: string;
    homeTeam?: string;
    awayTeam?: string;
    eventStatus: 'scheduled' | 'in_progress' | 'finished';
    isActive: boolean;
    bookingsCount: number;
    attendeesCount: number;
    totalRevenue: number;
  }
  
  export interface SportEvent {
    idEvent: string;
    strEvent: string;
    strTimestamp: string;
    strLeague?: string;
    strHomeTeam?: string;
    strAwayTeam?: string;
    strThumb?: string; // Event thumbnail
  }