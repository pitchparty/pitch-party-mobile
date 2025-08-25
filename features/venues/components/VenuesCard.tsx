import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { router } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Venue } from "../hooks/useVenues";

interface VenueCardProps {
  venue: Venue;
  onPress?: () => void;
}

const VenueCard: React.FC<VenueCardProps> = ({ 
  venue, 
  onPress 
}) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
    } else {
      router.push(`/venues/venue/${venue.id}`);
    }
  };

  return (
    <TouchableOpacity
      className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-sm"
      onPress={handlePress}
    >
      <View className="relative">
        <Image
          source={{ 
            uri: venue.image_url || 'https://via.placeholder.com/400x200?text=No+Image' 
          }}
          className="w-full h-40"
          resizeMode="cover"
        />
        <View className="absolute top-2 right-2 bg-blue-500 px-2 py-1 rounded-md">
          <Text className="text-white text-xs font-medium">
            {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)}
          </Text>
        </View>
      </View>
      
      <View className="p-4">
        <Text className="text-lg font-bold text-gray-800 dark:text-white mb-1">
          {venue.name}
        </Text>
        
        <View className="flex-row items-center">
          <Ionicons name="location-outline" size={16} color="#6B7280" />
          <Text className="text-gray-600 dark:text-gray-400 text-sm ml-1">
            {venue.city}, {venue.state}
          </Text>
        </View>
        
        {venue.description && (
          <Text 
            className="text-gray-600 dark:text-gray-400 text-sm mt-2"
            numberOfLines={2}
          >
            {venue.description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export default VenueCard;