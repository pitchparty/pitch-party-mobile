// File: hooks/useVenueStats.ts
import { useQuery } from '@tanstack/react-query';
import { fetchVenueStats, fetchManagerVenueStats, VenueStats } from '../../api/venueStatsApi';

/**
 * Hook to fetch venue statistics for a manager
 * @param managerId The ID of the manager
 * @param useJunctionTable Whether to use venue_managers junction table or direct manager_id
 */
export function useVenueStats(managerId: string | undefined, useJunctionTable = false) {
  return useQuery<VenueStats, Error>({
    queryKey: ['venueStats', managerId],
    queryFn: () => {
      if (!managerId) throw new Error('Manager ID is required');
      return useJunctionTable 
        ? fetchManagerVenueStats(managerId) 
        : fetchVenueStats(managerId);
    },
    enabled: !!managerId,
    // Refresh every 5 minutes if the window is focused
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
    retry: 2,
    // Default values if data is loading or error occurs
    placeholderData: {
      totalVenues: 0,
      activeVenues: 0,
      publishedVenues: 0,
      draftVenues: 0,
      averageRating: null,
      totalPhotos: 0,
      pendingApproval: 0,
      archivedVenues: 0
    }
  });
}