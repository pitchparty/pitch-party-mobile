import { supabase } from '@/lib/supabase';

export interface VenueStats {
  totalVenues: number;
  activeVenues: number;
  publishedVenues: number;
  draftVenues: number;
  averageRating: number | null;
  totalPhotos: number;
  pendingApproval: number;
  archivedVenues: number;
}

/**
 * Fetch venue statistics for a manager
 * @param managerId The ID of the manager
 */
export async function fetchVenueStats(managerId: string): Promise<VenueStats> {
  const stats: VenueStats = {
    totalVenues: 0,
    activeVenues: 0,
    publishedVenues: 0,
    draftVenues: 0,
    averageRating: null,
    totalPhotos: 0,
    pendingApproval: 0,
    archivedVenues: 0,
  };

  try {
    // 1. Grouped venue status counts
    const { data: statusCounts, error: statusError } = await supabase
      .rpc('get_venue_status_counts', { manager: managerId });

    if (statusError) throw statusError;

    if (statusCounts) {
      statusCounts.forEach((item: any) => {
        const count = item.total || 0;
        stats.totalVenues += count;

        if (item.is_active) stats.activeVenues += count;
        if (!item.is_approved) stats.pendingApproval += count;

        switch (item.status) {
          case 'published':
            stats.publishedVenues += count;
            break;
          case 'draft':
            stats.draftVenues += count;
            break;
          case 'archived':
            stats.archivedVenues += count;
            break;
        }
      });
    }

    // 2. Average rating
    const { data: ratingData, error: ratingError } = await supabase
      .from('venues')
      .select('average_rating')
      .eq('manager_id', managerId)
      .not('average_rating', 'is', null);

    if (ratingError) throw ratingError;

    if (ratingData && ratingData.length > 0) {
      const totalRating = ratingData.reduce((sum, v) => sum + (v.average_rating || 0), 0);
      stats.averageRating = parseFloat((totalRating / ratingData.length).toFixed(1));
    }

    // 3. Total photos across manager's venues
    const { data: venueIdsData, error: venueIdsError } = await supabase
      .from('venues')
      .select('id')
      .eq('manager_id', managerId);

    if (venueIdsError) throw venueIdsError;

    const venueIds = (venueIdsData || []).map(v => v.id);

    if (venueIds.length > 0) {
      const { count: photoCount, error: photoError } = await supabase
        .from('venue_photos')
        .select('*', { count: 'exact', head: true })
        .eq('is_deleted', false)
        .in('venue_id', venueIds);

      if (photoError) throw photoError;

      stats.totalPhotos = photoCount || 0;
    }

    return stats;
  } catch (error) {
    console.error('Error fetching venue stats:', error);
    throw error;
  }
}

/**
 * Alternative approach using venue_managers junction table
 * Use this if manager_id is not directly in venues table
 */
export async function fetchManagerVenueStats(managerId: string): Promise<VenueStats> {
  // Initialize stats object with default values
  const stats: VenueStats = {
    totalVenues: 0,
    activeVenues: 0,
    publishedVenues: 0,
    draftVenues: 0,
    averageRating: null,
    totalPhotos: 0,
    pendingApproval: 0,
    archivedVenues: 0
  };

  try {
    // Get all venues managed by this manager
    const { data: venueManagers, error: venueError } = await supabase
      .from('venue_managers')
      .select('venue_id')
      .eq('manager_id', managerId);

      console.log("Venue Managers: ", venueManagers)
      console.error("Venue Error: ", venueError)

      if (venueError) throw venueError;

    if (!venueManagers || venueManagers.length === 0) {
      return stats; // Return default stats if no venues
    }
    
    const venueIds = venueManagers.map(vm => vm.venue_id);
    stats.totalVenues = venueIds.length;
    
    // Get status counts
    const { data: statusCounts, error: statusError } = await supabase
      .from('venues')
      .select('status, is_active, is_approved, count(*)', { count: 'exact' })
      .in('id', venueIds)
      .group('status, is_active, is_approved');

      console.log("Status Counts: ", statusCounts)
      console.error("Status Error: ", statusError)
      
      if (statusError) throw statusError;

    // Process the grouped results
    if (statusCounts) {
      statusCounts.forEach((item: { is_active: any; count: number; status: string; is_approved: any; }) => {
        if (item.is_active) {
          stats.activeVenues += (item.count as number);
        }
        
        if (item.status === 'published') {
          stats.publishedVenues += (item.count as number);
        } else if (item.status === 'draft') {
          stats.draftVenues += (item.count as number);
        } else if (item.status === 'archived') {
          stats.archivedVenues += (item.count as number);
        }
        
        if (!item.is_approved) {
          stats.pendingApproval += (item.count as number);
        }
      });
    }

    // Get average rating across all venues
    const { data: ratingData, error: ratingError } = await supabase
      .from('venues')
      .select('average_rating')
      .in('id', venueIds)
      .not('average_rating', 'is', null);

      console.log("Rating Data: ", ratingData)
      console.error("Rating Error: ", ratingError)
      
      if (ratingError) throw ratingError;

    if (ratingData && ratingData.length > 0) {
      const totalRating = ratingData.reduce((sum, venue) => sum + (venue.average_rating || 0), 0);
      stats.averageRating = ratingData.length > 0 ? parseFloat((totalRating / ratingData.length).toFixed(1)) : null;
    }

    // Get total photos count
    const { count: photoCount, error: photoError } = await supabase
      .from('venue_photos')
      .select('*', { count: 'exact', head: true })
      .eq('is_deleted', false)
      .in('venue_id', venueIds);

      console.log("Photo Count: ", photoCount) // Log the photo count for debuggi`
    console.error("Photo Error: ", photoError)

    if (photoError) throw photoError;
    stats.totalPhotos = photoCount || 0;

    return stats;
  } catch (error) {
    console.error('Error fetching venue stats:', error);
    throw error;
  }
}