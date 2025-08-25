import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  fetchVenuesCount,
  fetchVenuesByManager,
  fetchVenueById,
  createVenue,
  updateVenue,
  deleteVenue,
  fetchFavoriteVenues,
  addFavoriteVenue,
  removeFavoriteVenue,
  fetchTodaysRevenue,
  fetchActiveVenues,
  upsertVenue,
  fetchVenues,
  updateVenueStatus,
  fetchVenueImages,
  fetchVenueDocuments,
} from "./api";
import {
  VenueWithManager,
  Venue,
  VenuePayload,
  FavoriteVenueWithDetails,
} from "./types";
import { VenueSchemaPayload } from "./schema";
import { toast } from "sonner-native";
import { router } from "expo-router";

const VENUES_KEY = "venues";
const FAVORITE_VENUES_KEY = "favorite_venues";

/* ============================
   Create
   ============================ */

/* ============================
   Read
   ============================ */

export const useVenueList = () =>
  useQuery({
    queryKey: ["venues"],
    queryFn: fetchVenues,
  });

export const useVenueDetail = (id: string) =>
  useQuery({
    queryKey: ["venues", id],
    queryFn: () => fetchVenueById(id),
    enabled: !!id,
  });

export const useVenueImages = (id: string) =>
  useQuery({
    queryKey: ["venue-images", id],
    queryFn: () => fetchVenueImages(id),
    enabled: !!id,
  });

export const useVenueByManager = (id: string) =>
  useQuery({
    queryKey: ["venues-by-manager", id],
    queryFn: () => fetchVenuesByManager(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5,
  });

export const useVenueDocuments = (id: string) =>
  useQuery({
    queryKey: ["venues-documents", id],
    queryFn: () => fetchVenueDocuments(id),
    enabled:!!id,
    staleTime: 1000 * 60 * 5,
  });

/* ============================
   Update
   ============================ */

export const useVenueUpsert = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: upsertVenue,
    onSuccess: (data) => {
      const id = data.id;
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      queryClient.invalidateQueries({ queryKey: ["venues", id] });
    },
  });
};

export const useVenueStatusUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateVenueStatus,
    onSuccess: (data) => {
      const id = data.id;
      queryClient.invalidateQueries({ queryKey: ["venues"] });
      queryClient.invalidateQueries({ queryKey: ["admin-pending-venues"] });
      queryClient.invalidateQueries({ queryKey: ["venues", id] });
    },
  });
};

/* ============================
   Delete
   ============================ */

export const useVenueDelete = () => {
  const queryClient = useQueryClient();
  useMutation({
    mutationFn: deleteVenue,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["venues"] });
    },
  });
};

export const useTodaysRevenue = (userId: string) => {
  return useQuery({
    queryKey: ["todaysRevenue", userId],
    queryFn: () => fetchTodaysRevenue(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Fetch all venues with manager details
 */
export const useTotalVenues = (userId: string) => {
  return useQuery({
    queryKey: ["totalVenues", userId],
    queryFn: () => fetchVenuesCount(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 2,
  });
};

export const useActiveVenues = () => {
  return useQuery({
    queryKey: ["activeVenues"],
    queryFn: fetchActiveVenues,
    staleTime: 1000 * 60 * 2,
  });
};

/**
 * Fetch venues managed by a specific manager
 * @param manager_id - ID of the manager
 */
export const useFetchVenuesByManager = (manager_id: string) => {
  return useQuery<VenueWithManager[]>({
    queryKey: ["venues", "manager", manager_id],
    queryFn: () => fetchVenuesByManager(manager_id),
    enabled: !!manager_id, // Only run when manager_id is available
  });
};

/**
 * Fetch venue details by ID
 * @param id - Venue ID
 */
export const useFetchVenueById = (id: string) => {
  return useQuery<Venue>({
    queryKey: ["venue", id],
    queryFn: () => fetchVenueById(id),
    enabled: !!id,
  });
};

/**
 * Create a new venue
 */
export const useCreateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (venue: VenueSchemaPayload) => createVenue(venue),
    onSuccess: (data) => {
      toast.success("Venue Created", {
        description:
          "Kindly wait for approval, in the meantime you can validate your email and explore PitchParty",
      });
      router.replace("/(auth)/onboarding");
      queryClient.invalidateQueries({ queryKey: [VENUES_KEY] });
    },
    onError: (error) => {
      toast.error("Venue Creation Failed", { description: error.message });
    },
  });
};

/**
 * Update a venue
 * @param id - Venue ID
 */
export const useUpdateVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, venue }: { id: string; venue: Partial<VenuePayload> }) =>
      updateVenue(id, venue),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [VENUES_KEY] });
    },
  });
};

/**
 * Delete a venue
 * @param id - Venue ID
 */
export const useDeleteVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteVenue(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [VENUES_KEY] });
    },
  });
};

/**
 * Fetch user's favorite venues
 * @param user_id - User ID
 */
export const useFavoriteVenues = (user_id: string) => {
  return useQuery<FavoriteVenueWithDetails[]>({
    queryKey: ["favorite_venues", user_id],
    queryFn: () => fetchFavoriteVenues(user_id),
    enabled: !!user_id,
  });
};

/**
 * Add venue to favorites
 */
export const useAddFavoriteVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      user_id,
      venue_id,
    }: {
      user_id: string;
      venue_id: string;
    }) => addFavoriteVenue(user_id, venue_id),
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({
        queryKey: [FAVORITE_VENUES_KEY, user_id],
      });
    },
  });
};

/**
 * Remove venue from favorites
 */
export const useRemoveFavoriteVenue = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => removeFavoriteVenue(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: [FAVORITE_VENUES_KEY] });
    },
  });
};
