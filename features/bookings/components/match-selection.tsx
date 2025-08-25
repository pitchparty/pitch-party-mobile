import React from "react";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

import { useBookingStore } from "../stores/useBookingStore";
import { BookingSelectionCard } from "./booking-selection-card";

interface MatchSelectionProps {
  onPress: () => void;
}

export const MatchSelection: React.FC<MatchSelectionProps> = ({ onPress }) => {
  const selectedMatch = useBookingStore((state) => state.selectedMatch);

  const utcDateTime = new Date(`${selectedMatch?.dateEvent}T${selectedMatch?.strTime}Z`);

  // Format it in local time
  const localTime = utcDateTime.toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  
  const localDate = utcDateTime.toLocaleDateString([], {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <BookingSelectionCard title="Select Match" justify>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between"
      >
        <View className="flex-1 pr-4">
          <View className="flex-row items-center">
            <MaterialIcons
              name="sports-soccer"
              size={20}
              color="#3B82F6"
              className="mr-2"
            />
            {selectedMatch ? (
              <Text className="text-gray-700 dark:text-gray-100 font-medium text-base">
                {selectedMatch.strHomeTeam} vs {selectedMatch.strAwayTeam}
              </Text>
            ) : (
              <Text className="text-gray-700 dark:text-gray-100 font-medium text-base">
                Match Name
              </Text>
            )}
          </View>

          <Text className="text-gray-400 dark:text-gray-300 text-sm mt-1 ml-7">
            {selectedMatch
              ? `${localDate} @ ${localTime}`
              : "Select match to continue..."}
          </Text>
        </View>

        <View className="bg-blue-50 p-2 rounded-full">
          <MaterialIcons name="chevron-right" size={24} color="#3B82F6" />
        </View>
      </TouchableOpacity>
    </BookingSelectionCard>
  );
};
