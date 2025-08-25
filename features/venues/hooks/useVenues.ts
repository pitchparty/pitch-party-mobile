import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

// Define the Venue type
export interface Venue {
  id: string;
  name: string;
  description?: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  image_url?: string;
  manager_id: string;
  status: 'draft' | 'published' | 'archived';
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

/**
 * Hook to fetch venues managed by a specific user
 * @param managerId - The ID of the manager
 */
export const useVenues = (managerId: string) => {
  return useQuery({
    queryKey: ['venues', managerId],
    queryFn: async (): Promise<Venue[]> => {
      // Fetch venues where manager_id matches the provided ID
      const { data, error } = await supabase
        .from('venues')
        .select('*')
        .eq('manager_id', managerId);
      
      if (error) {
        throw new Error(`Error fetching venues: ${error.message}`);
      }
      
      return data || [];
    },
  });
};