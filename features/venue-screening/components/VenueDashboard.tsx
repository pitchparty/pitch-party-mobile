import React, { useEffect } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useVenueStreamStore } from '../store/venueStreamStore';
import { Venue } from '../types';

export function VenueDashboard() {
  const router = useRouter();
  const { venues, venueStreams, fetchVenues, fetchVenueStreams, selectVenue, isLoading } = useVenueStreamStore();
  
  useEffect(() => {
    fetchVenues();
  }, []);

  const handleVenueSelect = async (venue: Venue) => {
    selectVenue(venue);
    await fetchVenueStreams(venue.id);
    router.push(`/venues/venue-screening/${venue.id}`);
  };

  const getScreeningCount = (venueId: string) => (venueStreams[venueId] || []).length;

  const renderVenueCard = (item: Venue) => (
    <Pressable
      onPress={() => handleVenueSelect(item)}
      className="bg-white dark:bg-gray-800 rounded-xl p-4 mb-4 shadow"
    >
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">{item.name}</Text>
        <View
          className={`px-2 py-1 rounded-full ${
            item.isActive ? 'bg-primary' : 'bg-warning'
          }`}
        >
          <Text className="text-xs font-medium text-white">
            {item.isActive ? 'Active' : 'Inactive'}
          </Text>
        </View>
      </View>

      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-3">
        {item.address}
      </Text>

      <View className="flex-row justify-between">
        <View className="items-center">
          <Text className="text-xs text-gray-500 dark:text-gray-400">Capacity</Text>
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {item.capacity || 'N/A'}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-500 dark:text-gray-400">Rating</Text>
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {item.averageRating?.toFixed(1) || 'N/A'}
          </Text>
        </View>
        <View className="items-center">
          <Text className="text-xs text-gray-500 dark:text-gray-400">Screenings</Text>
          <Text className="text-base font-semibold text-gray-900 dark:text-gray-100">
            {getScreeningCount(item.id)}
          </Text>
        </View>
      </View>
    </Pressable>
  );

  return (
    <View className="flex-1 px-4 pt-4 bg-blue-50 dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-1 text-gray-900 dark:text-gray-100">
      Venue Screening
      </Text>
      <Text className="text-sm text-gray-600 dark:text-gray-400 mb-4">
      Venues are ready for screening.
      </Text>
     

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-base text-gray-600 dark:text-gray-300">Loading venues...</Text>
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} className="pb-4">
          {venues.map((item) => (
            <React.Fragment key={item.id}>{renderVenueCard(item)}</React.Fragment>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
