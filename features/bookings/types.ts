export type BookingParams = {
  amount: string;
  away_team: string;
  away_team_logo: string;
  event_date: string;
  event_time: string;
  event_venue: string;
  home_team: string;
  home_team_logo: string;
  league: string;
  party_size: number;
  special_requests: string;
  status: string;
  venue_id: string;
  user_id: string;
};

export interface BookingQueryParams {
  id?: string; // The booking table's primary key
  orderMerchantReference?: string; // Maps to external_reference
}

export interface BookingItem {
  id: string;
  booking_code: string;
  payment_status: string;
  amount: string;
  away_team: string;
  away_team_logo: string;
  event_date: string;
  event_time: string;
  event_venue: string;
  home_team: string;
  home_team_logo: string;
  league: string;
  party_size: number;
  special_requests: string;
  status: string;
  user: BookingUser;
  venues: BookedVenues;
}

export interface BookingUser {
  id: string;
  first_name: string;
  last_name: string;
  username: string;
  phone_number: string;
}

export interface BookingManager {
  id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
}

export interface BookedVenues {
  id: string;
  name: string;
  address: string;
  amenities: string[];
  longitude: string;
  latitude: string;
  contact_phone: string;
  contact_email: string;
  manager: BookingManager;
}
