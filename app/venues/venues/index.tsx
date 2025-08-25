// File: app/(app)/my-venues/index.tsx
import React, { useLayoutEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, TouchableOpacity, Image, SafeAreaView } from 'react-native';
import { Link, useNavigation } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { Feather } from '@expo/vector-icons';
import { useAuthStore } from '@/features/authentication/store';
import { fetchManagerVenues } from '@/features/venues/api/venue-api';
import VenueStatusBadge from '@/features/venues/components/VenueStatusBadge';
import VenueRating from '@/features/venues/components/VenueRating';
import LoadingState from '@/features/venues/components/ui/LoadingState';
import ErrorState from '@/features/venues/components/ui/ErrorState';

// Types
interface Venue {
  id: string;
  name: string;
  address: string;
  status: 'draft' | 'published' | 'archived';
  average_rating: number;
  created_at: string;
  is_active: boolean;
  is_approved: boolean;
  primary_photo?: {
    photo_url: string;
  };
}

export default function MyVenuesScreen() {
  const { user } = useAuthStore();

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'My Venues',
    });
  }, [navigation]);

  const { 
    data: venues,
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['managerVenues', user?.id],
    queryFn: () => fetchManagerVenues(user?.id!),
    enabled: !!user?.id,
  });


  const VenueItem = ({ venue }: { venue: Venue }) => (
    <Link href={`/venues/venue/${venue.id}`} asChild>
      <TouchableOpacity 
        className="bg-white rounded-lg shadow-sm mb-4 overflow-hidden"
        activeOpacity={0.7}
      >
        <View>
          {venue.primary_photo ? (
            <Image 
              source={{ uri: venue.primary_photo.photo_url }} 
              className="w-full h-36"
              resizeMode="cover"
            />
          ) : (
            <View className="w-full h-36 bg-gray-200 items-center justify-center">
              <Feather name="image" size={36} color="#9CA3AF" />
            </View>
          )}
          
          <View className="p-4">
            <View className="flex-row justify-between items-start">
              <View className="flex-1 mr-2">
                <Text className="text-lg font-bold text-gray-800">{venue.name}</Text>
                <Text className="text-gray-500 text-sm mt-1">{venue.address}</Text>
              </View>
              <VenueStatusBadge status={venue.status} />
            </View>
            
            <View className="flex-row justify-between items-center mt-4">
              <VenueRating rating={venue.average_rating} />
              
              <View className="flex-row items-center">
                <View className={`h-2.5 w-2.5 rounded-full mr-1.5 ${venue.is_active ? 'bg-green-500' : 'bg-gray-400'}`} />
                <Text className="text-xs text-gray-500">
                  {venue.is_active ? 'Active' : 'Inactive'}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </Link>
  );

  const EmptyVenueList = () => (
    <View className="items-center justify-center py-16">
      <Feather name="home" size={48} color="#D1D5DB" />
      <Text className="text-gray-500 text-lg mt-4 text-center">
        You don't have any venues yet
      </Text>
      <Link href="/venues/add/new-shop" asChild>
        <TouchableOpacity 
          className="mt-6 bg-blue-600 py-3 px-6 rounded-full"
          activeOpacity={0.8}
        >
          <Text className="text-white font-medium">Create Your First Venue</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );

  if (isLoading) {
    return <LoadingState message="Loading venues..." />;
  }

  if (isError && error instanceof Error) {
    return (
      <ErrorState 
        message={error.message || 'Error loading venues'} 
        onRetry={refetch} 
      />
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-blue-50 dark:bg-gray-900" >
      <FlatList
        data={venues}
        keyExtractor={(item) => item.id}
        // @ts-ignore
        renderItem={({ item }) => <VenueItem venue={item} />}
        ListEmptyComponent={<EmptyVenueList />}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
}