import { supabase } from "@/lib/supabase";
import {
  FavoriteVenueWithDetails,
  Venue,
  VenueDetailsWithManager,
  VenueDocument,
  VenuePayload,
  VenueUpsertPayload,
  VenueWithManager,
} from "./types";
import { VenueSchemaPayload } from "./schema";

const TABLE_NAME = "venues";

/* ============================
   Common Venue Actions
   ============================ */

   /*  CREATE VENUE */
   /*  READ VENUE */
   /*  UPDATE VENUE */
   /*  DELETE VENUE */

/* ============================
   Admin
   ============================ */

   /*  CREATE VENUE */
   /*  READ VENUE */

   // Fetch all venues
export const fetchVenues = async () => {
  const { data, error } = await supabase
    .from("venues")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data as Venue[];
};

   /*  UPDATE VENUE */

  export const updateVenueStatus = async ({
    id,
    status,
    is_active,
  }: {
    id: string;
    status: Venue["status"];
    is_active: boolean;
  }) => {
    const { data, error } = await supabase
      .from("venues")
      .update({ status, is_active })
      .eq("id", id)
      .select()
      .single();
  
    if (error) throw error;
    return data as Venue;
  };
  
   /*  DELETE VENUE */
   export const deleteVenue = async (id: string) => {
    const { error } = await supabase.from("venues").delete().eq("id", id);
  
    if (error) throw error;
  };


/* ============================
   Manager
   ============================ */

   /*  CREATE VENUE */
   export const createVenue = async (
    venue: VenueSchemaPayload
  ): Promise<Venue> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .insert(venue)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  };
  
   /*  READ VENUE */

   export const fetchVenuesByManager = async (
    manager_id: string
  ): Promise<VenueDetailsWithManager[]> => {
    const { data, error } = await supabase
      .from(TABLE_NAME)
      .select(
        `
        id, name, address, longitude, latitude, amenities, pricing, redemption_option,
        average_rating, capacity, created_at, updated_at, is_active, contact_phone, contact_email,
        profiles!inner(id, first_name, last_name, email_address)
      `
      )
      .eq("manager_id", manager_id);
  
    if (error) throw error;if (error) {
      console.error("Error fetching venues:", error);
      /* @ts-ignore */ 
      throw new Error(`Failed to fetch venues: ${error?.message}`);
    }
  
    if (!data) {
      return [];
    }
  
    return data.map((venue) => ({
      id: venue.id,
      name: venue.name,
      address: venue.address,
      longitude: venue.longitude,
      latitude: venue.latitude,
      amenities: venue.amenities,
      pricing: venue.pricing,
      redemption_option: venue.redemption_option,
      average_rating: venue.average_rating,
      capacity: venue.capacity,
      created_at: venue.created_at,
      updated_at: venue.updated_at,
      is_active: venue.is_active,
      contact_phone: venue.contact_phone,
      contact_email: venue.contact_email,
      manager: {
        id: venue.profiles?.id,
        full_name: venue.profiles?.first_name + " " + venue.profiles?.last_name,
        email_address: venue.profiles?.email_address,
      },
      // documents: venue.venue_documents.map((doc) => ({
      //   id: doc.id,
      //   asset_url: doc.asset_url,
      //   document_type: doc.document_type,
      // })),
    }));
  };


  export const fetchVenueDocuments = async (
    venue_id: string
  ): Promise<VenueDocument[]> => {
    const { data, error } = await supabase
      .from('venue_documents')
      .select(
        ` id, venue_id, document_url, document_type, is_verified
      `
      )
     .eq("venue_id", venue_id);
    if (error) throw error;
    return data || [];
  };
  
   /*  UPDATE VENUE */

   // Create or update venue
export const upsertVenue = async (venue: VenueUpsertPayload) => {
  const { data, error } = await supabase
    .from("venues")
    .upsert(venue)
    .select()
    .single();

  if (error) throw error;
  return data as Venue;
};

   /*  DELETE VENUE */


/* ============================
   User
   ============================ */

   /*  CREATE VENUE */
   /*  READ VENUE */
   /*  UPDATE VENUE */
   /*  DELETE VENUE */



// Fetch all venues
export const fetchVenuesCount = async (userId: string) => {
  const { data, error, count } = await supabase
    .from(TABLE_NAME)
    .select(
      "id, name, latitude, longitude, average_rating, capacity, amenities",
      { count: "exact" }
    )
    .eq("manager_id", userId);

  if (error) throw error;
  return { data, count };
};

export const fetchTodaysRevenue = async (userId: string) => {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabase
    .from("payments")
    .select("amount, booking:bookings(booking_date, venue:venues(manager_id))")
    .eq("booking.booking_date", today)
    .eq("booking.venue.manager_id", userId)
    .eq("status", "completed");

  if (error) throw error;
  // Calculate total revenue
  const totalRevenue =
    data?.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  return totalRevenue;
};

// Fetch all venues with manager details
export const fetchActiveVenues = async (): Promise<VenueWithManager[]> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select(
      `
      *,
      profiles:manager_id (id, username)
    `
    )
    .eq("is_active", true);
  if (error) throw error;

  return data.map((venue) => ({
    ...venue,
    manager: Array.isArray(venue.profiles) ? venue.profiles[0] : venue.profiles,
  }));
};

// Fetch a specific venue by ID
export const fetchVenueById = async (id: string): Promise<Venue> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .select("*")
    .eq("id", id)
    .single();
  if (error) throw error;
  return data;
};

export const fetchVenueImages = async (id: string): Promise<{
  id: string;
  venue_id: string;
  photo_url: string;
}[]> => {
  const { data, error } = await supabase
    .from("venue_photos")
    .select("*")
    .eq("venue_id", id)
    console.log("VENUE IMAGES", data);
  if (error) throw error;
  return data || [];
};


/* ============================
   ADMIN + MANAGER-SPECIFIC VENUE APIS
   ============================ */

// Create a new venue


// Update an existing venue
export const updateVenue = async (
  id: string,
  venue: Partial<VenuePayload>
): Promise<Venue> => {
  const { data, error } = await supabase
    .from(TABLE_NAME)
    .update(venue)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
};

/* ============================
   USER FAVORITE VENUE APIS
   ============================ */

// Fetch user's favorite venues with details
export const fetchFavoriteVenues = async (
  user_id: string
): Promise<FavoriteVenueWithDetails[]> => {
  const { data, error } = await supabase
    .from("favorite_venues")
    .select(
      `
      id, created_at,
      venue:venue_id (id, name, address, photos, average_rating, amenities, capacity)
    `
    )
    .eq("user_id", user_id);

  if (error) throw error;

  return data.map((fav) => ({
    id: fav.id,
    created_at: fav.created_at,
    user_id,
    venue: fav.venue[0],
  }));
};

// Add a venue to user's favorites
export const addFavoriteVenue = async (
  user_id: string,
  venue_id: string
): Promise<void> => {
  const { error } = await supabase
    .from("favorite_venues")
    .insert([{ user_id, venue_id }]);
  if (error) throw error;
};

// Remove a venue from user's favorites
export const removeFavoriteVenue = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from("favorite_venues")
    .delete()
    .eq("id", id);
  if (error) throw error;
};






