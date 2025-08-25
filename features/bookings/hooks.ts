import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { Booking, BookingFilter, BookingQueryParams } from "./types";
import {
  fetchBookings,
  fetchBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  fetchTodaysBookings,
  fetchPendingBookings,
  fetchUserBookings,
  fetchSingleBooking,
  fetchManagerBookings,
  cancelBooking,
  confirmBooking,
  fetchAllBookings,
} from "./api";
import { toast } from "sonner-native";
import { router } from "expo-router";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "../authentication/store";

// === Booking Hooks ===
// Fetch and cache bookings with filters
export const useBookings = (filters: BookingFilter = {}) =>
  useQuery({
    queryKey: ["bookings", filters],
    queryFn: () => fetchBookings(filters),
  });

// Fetch and cache a single booking
export const useBooking = (id: string) =>
  useQuery({
    queryKey: ["booking", id],
    queryFn: () => fetchBookingById(id),
  });

// Fetch users bookings
export const useUserBookings = (userId: string) =>
  useQuery({
    queryKey: ["userBookings", userId],
    queryFn: () => fetchUserBookings(userId),
  });

// Fetch manager bookings
export const useAllBookings = () =>
  useQuery({
    queryKey: ["allBookings"],
    queryFn: () => fetchAllBookings(),
  });

// Create a booking with cache invalidation
export const useCreateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

// Update a booking with cache invalidation
export const useUpdateBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Booking> }) =>
      updateBooking(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

// Delete a booking with cache invalidation
export const useDeleteBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });
};

export const useTodaysBookings = (venueId: string) => {
  return useQuery({
    queryKey: ["todaysBookings", venueId],
    queryFn: () => fetchTodaysBookings(venueId),
    enabled: !!venueId,
  });
};

export const usePendingBookings = (venueId: string) => {
  return useQuery({
    queryKey: ["pendingBookings", venueId],
    queryFn: () => fetchPendingBookings(venueId),
    enabled: !!venueId,
  });
};

export const useSingleBooking = (params: BookingQueryParams) => {
  const id = params.id || params.orderMerchantReference;
  return useQuery({
    queryKey: ["singleUserBooking", id],
    queryFn: () => fetchSingleBooking(params),
    enabled: !!id,
  });
};

export const useManagerBookings = (venueId: string) => {
  return useQuery({
    queryKey: ["managerBookings", venueId],
    queryFn: () => fetchManagerBookings(venueId),
    enabled: !!venueId,
  });
};

// Cancel a booking with cache invalidation
export const useCancelBooking = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelBooking,
    onSuccess: async (data, variables) => {
      toast.success("Booking cancelled successfully", {
        description: `Your booking has been cancelled successfully`,
      });
      await queryClient.invalidateQueries({
        queryKey: ["managerBookings"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["singleUserBooking"],
      });
    },
  });
};

// Confirm a booking with cache invalidation
export const useConfirmBooking = () => {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);
  return useMutation({
    mutationFn: confirmBooking,
    onSuccess: async (variables) => {
      toast.success("Booking confirmed successfully", {
        description: `Your booking has been confirmed successfully`,
      });

     await queryClient.invalidateQueries({
        queryKey: ["managerBookings"],
      });
      await queryClient.invalidateQueries({
        queryKey: ["singleUserBooking"],
      });
    },
  });
};
