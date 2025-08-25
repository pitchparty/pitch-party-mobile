import {
  fetchTodaysBookings,
  fetchPendingBookings,
} from "@/features/bookings/api";
import { fetchTodaysRevenue, fetchVenuesCount } from "@/features/venues/api";
import { supabase } from "@/lib/supabase";
import { useQueryClient, useQuery } from "@tanstack/react-query";

interface Stat {
  id: number;
  title: string;
  value: number | string;
  icon: string;
  color: string;
}

const getCurrentUser = async () => {
  const { data } = await supabase.auth.getUser();
  return data.user;
};

export const useManagerStats = () => {
  const queryClient = useQueryClient();

  // Query to get the current user
  const userQuery = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
    staleTime: 1000 * 60 * 5, // Consider user data fresh for 5 minutes
  });

  const userId = userQuery.data?.id as string;

  // Query for today's bookings
  const todaysBookingsQuery = useQuery({
    queryKey: ["todaysBookings", userId],
    queryFn: () => fetchTodaysBookings(userId),
    enabled: !!userId, // Only run if we have a userId
    staleTime: 1000 * 60 * 2, // Consider data fresh for 2 minutes
  });

  // Query for pending bookings
  const pendingBookingsQuery = useQuery({
    queryKey: ["pendingBookings", userId],
    queryFn: () => fetchPendingBookings(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  // Query for venues
  const venuesQuery = useQuery({
    queryKey: ["venues", userId],
    queryFn: () => fetchVenuesCount(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // Venues don't change as frequently
  });

  // Query for today's revenue
  const revenueQuery = useQuery({
    queryKey: ["todaysRevenue", userId],
    queryFn: () => fetchTodaysRevenue(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });

  // Function to manually refresh all queries
  const refreshStats = () => {
    if (userId) {
      queryClient.invalidateQueries({ queryKey: ["todaysBookings", userId] });
      queryClient.invalidateQueries({ queryKey: ["pendingBookings", userId] });
      queryClient.invalidateQueries({ queryKey: ["venues", userId] });
      queryClient.invalidateQueries({ queryKey: ["todaysRevenue", userId] });
    }
  };

  // Format the data for UI display
  const stats: Stat[] = [
    {
      id: 1,
      title: "Today's Bookings",
      value: todaysBookingsQuery.data?.count ?? 0,
      icon: "calendar",
      color: "#4CAF50",
    },
    {
      id: 2,
      title: "Pending Actions",
      value: pendingBookingsQuery.data?.count ?? 0,
      icon: "time",
      color: "#FF9800",
    },
    {
      id: 3,
      title: "Today's Revenue",
      value: `$${revenueQuery.data?.toFixed(2) ?? "0.00"}`,
      icon: "cash",
      color: "#2196F3",
    },
    {
      id: 4,
      title: "Total Venues",
      value: venuesQuery.data?.count ?? 0,
      icon: "business",
      color: "#9C27B0",
    },
  ];

  const isLoading =
    userQuery.isLoading ||
    todaysBookingsQuery.isLoading ||
    pendingBookingsQuery.isLoading ||
    venuesQuery.isLoading ||
    revenueQuery.isLoading;

  const isError =
    userQuery.isError ||
    todaysBookingsQuery.isError ||
    pendingBookingsQuery.isError ||
    venuesQuery.isError ||
    revenueQuery.isError;

  return {
    stats,
    isLoading,
    isError,
    refreshStats,
    userQuery,
    todaysBookingsQuery,
    pendingBookingsQuery,
    venuesQuery,
    revenueQuery,
  };
};
