import { useState, useEffect } from 'react';
import { supabase } from '../../../lib/supabase';
import { useAuthStore } from '@/features/authentication/store';

export interface Shop {
  id: string;
  name: string;
  description: string;
  address: string;
  is_approved: boolean;
  is_active: boolean;
  owner_id: string;
  created_at: string;
}

export const useShops = () => {
  const { user } = useAuthStore();
  const [shops, setShops] = useState<Shop[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchShops = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, error } = await supabase
        .from('shops')
        .select('*')
        .eq('owner_id', user.id);
      
      if (error) throw error;
      setShops(data || []);
    } catch (err) {
      console.error('Error fetching shops:', err);
      setError('Failed to load your shops. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchShops();
  }, [user?.id]);

  return {
    shops,
    isLoading,
    error,
    refetch: fetchShops,
  };
};