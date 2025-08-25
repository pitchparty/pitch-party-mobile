import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";

import { Profile } from "../types";
import { getUserProfile, searchUsers, updateUserProfile } from "../api";
import { getActiveBookings, getNewUsers, getPendingVenues, getTotalRevenue, getTotalVenues } from "./api";

export const useUserProfile = (userId: string) => {
    return useQuery({
      queryKey: ['user-profile', userId],
      queryFn: () => getUserProfile(userId),
      enabled: !!userId
    });
  };
  
  export const useSearchUsers = (query: string) => {
    return useQuery({
      queryKey: ["search-users", query],
      queryFn: () => searchUsers(query),
      enabled: query.length === 0 || query.length >= 2, // Only search if query is empty or at least 2 characters
    });
  };
  
  export const useUpdateUserProfile = () => {
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationFn: ({ 
        userId, 
        updates 
      }: { 
        userId: string; 
        updates: Partial<Profile> 
      }) => updateUserProfile(userId, updates),
      onSuccess: (updatedProfile) => {
        queryClient.invalidateQueries({ 
          queryKey: ['user-profile', updatedProfile.id] 
        });
      }
    });
  };

/*
  Admin Dashboard
*/

  export const useActiveBookings = () => {
    return useQuery({
      queryKey: ['active-bookings'],
    queryFn: getActiveBookings,
  });
};

export const useTotalVenues = () => {
  return useQuery({
    queryKey: ['total-venues'],
    queryFn: getTotalVenues,
  });
};

export const useNewUsers = () => {
  return useQuery({
    queryKey: ['new-users'],
    queryFn: getNewUsers,
  });
};

export const useTotalRevenue = () => {
  return useQuery({
    queryKey: ['total-revenue'],
    queryFn: getTotalRevenue,
  });
};


export const usePendingVenues = () => {
  return useQuery({
    queryKey: ['admin-pending-venues'], 
    queryFn: getPendingVenues,  
    retry: 1,  
  });
};