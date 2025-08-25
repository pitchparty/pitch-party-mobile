// src/components/venues/VenueCard.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

import { Venue } from '../types';

type VenueCardProps = {
  venue: Venue;
  onPress: () => void;
  onStatusChange?: () => void;
};

export const VenueCard: React.FC<VenueCardProps> = ({ 
  venue, 
  onPress, 
  onStatusChange 
}) => {
  const getStatusColor = () => {
    switch (venue.status) {
      case 'draft': return { bg: 'bg-amber-100', text: 'text-amber-600' };
      case 'published': return { bg: 'bg-green-100', text: 'text-green-600' };
      case 'archived': return { bg: 'bg-red-100', text: 'text-red-600' };
      default: return { bg: 'bg-gray-100', text: 'text-gray-600' };
    }
  };

  const { bg, text } = getStatusColor();

  console.log("Venue status", venue.status);

  return (
    <TouchableOpacity 
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm mb-3 overflow-hidden"
      onPress={onPress}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View className="flex-1">
            <Text className="text-lg font-bold text-gray-800 dark:text-gray-200">
              {venue.name}
            </Text>
            <View className="flex-row items-center mt-1">
              <Ionicons name="location" size={14} color="#64748b" />
              <Text className="text-gray-500 dark:text-gray-200 text-sm ml-1">
                {venue.address}
              </Text>
            </View>
          </View>
          
          <TouchableOpacity 
            className={`px-2 py-1 rounded-full ${bg}`}
            onPress={onStatusChange}
          >
            <Text className={`text-xs font-medium ${text}`}>
              {venue.status}
              {/* {venue.status.charAt(0).toUpperCase() + venue.status.slice(1)} */}
            </Text>
          </TouchableOpacity>
        </View>
        
        <View className="flex-row mt-3 justify-between items-center">
          <View className="flex-row items-center">
            <Ionicons name="people" size={16} color="#1e40af" />
            <Text className="text-gray-800 dark:text-gray-200 font-medium ml-2">
              Capacity: {venue.capacity || 'N/A'}
            </Text>
          </View>
          
          {venue.average_rating && (
            <View className="flex-row items-center">
              <Ionicons name="star" size={16} color="#eab308" />
              <Text className="text-gray-600 dark:text-gray-200 font-medium ml-1">
                {venue.average_rating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};
