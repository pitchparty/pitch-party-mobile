// features/auth/hooks.ts
import { toast } from 'sonner-native';
import { User } from '@supabase/supabase-js';
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuthStore } from "./store";
import { signUpParams, UserProfile } from './types';
import { Profile } from '../profiles/types';
import { updateUserProfile } from '../profiles/api';
import { fetchUserProfile, signIn, signUp } from "./api";
import { router } from 'expo-router';


export const useSignIn = () => {
  const loggedIn = useAuthStore(state => state.loggedIn);
  return useMutation<User, Error, { email: string; password: string }>({
    mutationFn: ({ email, password }) => signIn(email, password),
    onSuccess: async(data) => {
        try {
          const profile = await fetchUserProfile(data.id);
          loggedIn(profile);
          toast.success("Sign In Successful", {
            description: "You have successfully signed in",
          });
        } catch (profileError) {
          toast.error("Failed to fetch user profile");
        }
    },
    onError: (error) => {
        toast.error('Sign In Failed', { description: error.message });
    },
  });
};

export const useSignUp = () => {
  return useMutation({
    mutationFn: (params: signUpParams) => signUp(params),
    onSuccess: () => {
        toast.success('Account Created');
        router.replace('/(auth)/onboarding');
    },
    onError: (error) => {   
        toast.error('Account Failed', {
          description: error.message,
        });
    },
  });
};


export const useProfileUpdate = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ userId, updates }: { userId: string; updates: Partial<Profile> }) => updateUserProfile(userId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });
};

export const useUserProfile = (userId: string) => {
  return useQuery<UserProfile, Error>({
    queryKey: ["user-profile", userId],
    queryFn: () => fetchUserProfile(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};