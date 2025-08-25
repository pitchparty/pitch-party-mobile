// Database schema types for Supabase

export type Manager = {
  id: string;
  created_at: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  is_active: boolean;
  profile_image?: string;
};

export type Venue = {
  id: string;
  created_at: string;
  name: string;
  description?: string;
  address: string;
  latitude: number;
  longitude: number;
  capacity?: string;
  amenities?: string[];
  contact_phone?: string;
  contact_email?: string;
  pricing?: string;
  average_rating?: number;
  status: 'draft' | 'published' | 'archived';
  is_active: boolean;
  manager_id: string;
  redemption_option?: boolean;
  photos?: string[];
};

export type VenueDocument = {
  id: string;
  created_at: string;
  venue_id: string;
  document_type: string;
  asset_url: string | string[];
  status?: 'pending' | 'approved' | 'rejected';
};

export type VenueWithManager = Venue & {
  manager: Manager;
};