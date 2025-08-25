import { supabase } from "@/lib/supabase";
import { User } from "@supabase/supabase-js";

import { signUpParams, UserProfile } from "./types";

export const signIn = async (
  email: string,
  password: string
): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw new Error(error.message);

  return data.user;
};

export const signOut = async () => {
  await supabase.auth.signOut();
};

export const getUser = async (): Promise<User | null> => {
  const { data } = await supabase.auth.getUser();
  return data?.user;
};

export const signUp = async (params: signUpParams) => {
  const { data, error } = await supabase.auth.signUp({
    email: params.email,
    password: params.password,
    options: {
      data: {
        username: params.username,
        phone_number: params.phone_number,
        role: params.role,
        first_name: params.first_name,
        last_name: params.last_name,
        email_address: params.email,
      },
    },
  });

  if (error?.message.includes("duplicate key") || error?.code === "23505") {
    console.error("User already exists.");
   throw new Error("This email is already in use. Please log in instead.");
  }
  if (error) throw new Error(error.message);
  return data.user;
};

export const fetchUserProfile = async (userId: string): Promise<UserProfile> => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error || !data) {
    throw new Error(error?.message || "Profile not found");
  }

  return data as UserProfile;
};