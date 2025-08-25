// Enum - consistent casing and values
export enum RedemptionOption {
  Redeemable = 'Redeemable',
  NonRedeemable = 'Non-Redeemable'
}

export type Venue = {
  id?: string;
  name: string;
  address: string;
  description?: string;
  longitude?: number;
  latitude?: number;
  amenities?: string[];
  photos?: string[];
  average_rating?: number;
  pricing?: string;
  redemption_option?: RedemptionOption;
  capacity?: number;
  contact_phone?: string;
  contact_email?: string;
  website_url?: string;
  social_links?: Record<string, string>;
  manager_id: string;
  created_at?: string;
  updated_at?: string;
  is_active: boolean;
  status: "draft" | "published" | "archived";
};

//  Start Venue Details
export type ManagerProfile = {
  id: string;
  first_name: string;
  last_name: string;
  email_address: string;
};

export type VenueDocument = {
  id: string;
  venue_id: string;
  document_url: string;
  document_type: string;
  is_verified: boolean;
};

export type VenueDetailsWithManager = {
  id: string;
  name: string;
  address: string;
  longitude: number | null;
  latitude: number | null;
  amenities: string[] | null;
  pricing: string | null;
  redemption_option: string | null;
  average_rating: number | null;
  capacity: number | null;
  created_at: string;
  updated_at: string;
  is_active: boolean | null;
  contact_phone: string;
  contact_email: string;
  manager: ManagerProfile;
};

//  END

export type VenuePayload = Omit<Venue, "id" | "created_at" | "updated_at">;

export type VenueRegisterPayload = Omit<
  Venue,
  "id" | "created_at" | "updated_at" | "manager_id" | "is_active"
>;

export type VenueUpsertPayload = Omit<Venue, 'id' | 'created_at' | 'updated_at'> & {
  id?: string;
};

export type FavoriteVenue = {
  id: string;
  venue_id: string;
  created_at: string;
};

export type FavoriteVenuePayload = Omit<FavoriteVenue, "id" | "created_at">;

export type BasicVenue = Pick<
  Venue,
  | "id"
  | "name"
  | "address"
  | "photos"
  | "average_rating"
  | "amenities"
  | "capacity"
>;

export type FavoriteVenueWithDetails = Omit<FavoriteVenue, "venue_id"> & {
  venue: BasicVenue;
};
