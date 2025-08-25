// File: api/venueApi.ts
import { supabase } from '@/lib/supabase';

// Types
export interface Venue {
  id: string;
  name: string;
  address: string;
  description: string | null;
  status: 'draft' | 'published' | 'archived';
  average_rating: number | null;
  pricing: number | null;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface VenueWithPhoto extends Venue {
  primary_photo?: {
    id: string;
    photo_url: string;
  } | null;
}

/**
 * Fetch all venues for a manager
 * @param managerId The ID of the manager
 */
export async function fetchManagerVenues(managerId: string): Promise<VenueWithPhoto[]> {
    const { data, error } = await supabase
    .from('venues')
    .select(`
      *,
      primary_photo:venue_photos!venue_photos_venue_id_fkey(is_primary, photo_url)
    `)
    .eq('manager_id', managerId)
    .order('created_at', { ascending: false });

  if (error) throw error;

  // Transform data to handle primary photo
  return data.map(venue => ({
    ...venue,
    primary_photo: (venue.primary_photo || []).find(p => p.is_primary) || null
  }));
}

/**
 * Alternative approach using venue_managers junction table
 * Use this if manager_id is not directly in venues table
 */
export async function fetchVenuesForManager(managerId: string): Promise<VenueWithPhoto[]> {
  const { data, error } = await supabase
    .from('venue_managers')
    .select(`
      venue:venue_id (
        *,
        primary_photo:venue_photos(id, photo_url)
      )
    `)
    .eq('manager_id', managerId)
    .eq('venue.primary_photo.is_primary', true)
    .order('venue.created_at', { ascending: false });

  if (error) throw error;

  // Transform the nested data structure
  return data.map(item => ({
    ...item.venue,
    primary_photo: item.venue.primary_photo?.[0] || null
  }));
}

/**
 * Fetch a single venue by ID
 * @param venueId The ID of the venue
 */
export async function fetchVenueById(venueId: string): Promise<Venue | null> {
  const { data, error } = await supabase
    .from('venues')
    .select('*')
    .eq('id', venueId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      // PGRST116 is the error code for "no rows found"
      return null;
    }
    throw error;
  }

  return data;
}

/**
 * Fetch venue photos
 * @param venueId The ID of the venue
 */
export async function fetchVenuePhotos(venueId: string) {
  const { data, error } = await supabase
    .from('venue_photos')
    .select('*')
    .eq('venue_id', venueId)
    .eq('is_deleted', false)
    .order('is_primary', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Create a new venue
 * @param venueData The venue data
 * @param managerId The ID of the manager
 */
export async function createVenue(venueData: Partial<Venue>, managerId: string): Promise<Venue> {
  // First insert the venue
  const { data: venue, error: venueError } = await supabase
    .from('venues')
    .insert({ ...venueData, manager_id: managerId })
    .select()
    .single();

  if (venueError) throw venueError;

  // If using the venue_managers junction table, add an entry
  // Uncomment if needed
  /*
  const { error: managerError } = await supabase
    .from('venue_managers')
    .insert({
      venue_id: venue.id,
      manager_id: managerId,
      is_primary: true,
      permissions: {
        can_edit: true,
        can_delete: true,
        can_manage_products: true,
      }
    });

  if (managerError) throw managerError;
  */

  return venue;
}

/**
 * Update a venue
 * @param venueId The ID of the venue
 * @param venueData The updated venue data
 */
export async function updateVenue(venueId: string, venueData: Partial<Venue>): Promise<Venue> {
  const { data, error } = await supabase
    .from('venues')
    .update(venueData)
    .eq('id', venueId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Toggle a venue's active status
 * @param venueId The ID of the venue
 * @param isActive Whether the venue should be active
 */
export async function toggleVenueStatus(venueId: string, isActive: boolean): Promise<Venue> {
  const { data, error } = await supabase
    .from('venues')
    .update({ is_active: isActive })
    .eq('id', venueId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

/**
 * Delete a venue
 * @param venueId The ID of the venue
 */
export async function deleteVenue(venueId: string): Promise<void> {
  const { error } = await supabase
    .from('venues')
    .delete()
    .eq('id', venueId);

  if (error) throw error;
}