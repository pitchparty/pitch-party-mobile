// src/api/metrics.ts
import { supabase } from "@/lib/supabase";

export const getActiveBookings = async () => {
  const { count } = await supabase
    .from("bookings")
    .select("*", { count: "exact" })
    .in("status", ["confirmed", "completed"]);
  return count || 0;
};

export const getTotalVenues = async () => {
  const { count } = await supabase
    .from("venues")
    .select("*", { count: "exact" });
  return count || 0;
};

export const getNewUsers = async () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .gte("created_at", thirtyDaysAgo.toISOString());
  return count || 0;
};

export const getTotalRevenue = async () => {
  const { data, error } = await supabase
    .from("payments")
    .select("amount")
    .eq("status", "paid");

  if (error) {
    console.error("Error fetching revenue:", error);
    return 0;
  }

  const totalRevenue = data.reduce(
    (sum, payment) => sum + (payment.amount || 0),
    0
  );
  return totalRevenue;
};


export const getPendingVenues = async () => {
  try {
    // Query the venues table for draft venues
    const { data, error } = await supabase
      .from('venues')
      .select('id, name, status, created_at') // Include created_at for priority calculation
      .eq('status', 'draft');

    if (error) {
      console.error('Error fetching pending venues:', error);
      return [];
    }

    // Define a threshold for "thirty days ago"
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    // Transform the data into the desired format
    const pendingVenues = data.map((venue) => {
      // Calculate priority dynamically
      const venueCreatedAt = new Date(venue.created_at);
      const priority = venueCreatedAt < thirtyDaysAgo ? 'high' : 'medium';

      return {
        id: venue.id,
        type: 'venue',
        action: 'Approve venue',
        target: venue.name,
        priority: priority, // Dynamically calculated priority
      };
    });

    return pendingVenues;
  } catch (err) {
    console.error('Unexpected error in getPendingVenues:', err);
    return [];
  }
};