import { supabase } from "@/lib/supabase";

import { Profile } from "./types";


// Fetch a single user profile by ID
export const getUserProfile = async (userId: string): Promise<Profile | null> => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) throw error;
  return data;
};

// Search for users by query (matches username, first name, or last name)
export const searchUsers = async (query: string): Promise<Profile[]> => {
  let request = supabase.from("profiles").select("*");

  if (query && query.length >= 2) {
    // Use full-text search with the search_vector column
    request = request.textSearch("search_vector", query, {
      type: "websearch", // Supports advanced search syntax (e.g., "john doe" for exact match)
      config: "english", // Match the language used in to_tsvector
    });
  }

  // Optional: Add sorting or filtering using the indexed columns
  request = request.order("created_at", { ascending: false }); // Use the created_at index for sorting

  const { data, error } = await request;

  if (error) throw error;
  return data || [];
};

// Update a user profile by ID with partial data
export const updateUserProfile = async (
  userId: string,
  updates: Partial<Profile>
): Promise<Profile> => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
};
