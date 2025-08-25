import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { VenueDocument } from '../schema/database';

export const useVenueDocuments = (venueId?: string) => {
  return useQuery({
    queryKey: ['venueDocuments', venueId],
    queryFn: async (): Promise<VenueDocument[]> => {
      if (!venueId) return [];
      
      const { data, error } = await supabase
        .from('venue_documents')
        .select('*')
        .eq('venue_id', venueId);
        
      if (error) throw error;
      
      return data || [];
    },
    enabled: !!venueId,
  });
};