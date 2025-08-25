import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

import { useBookingStore } from "../../bookings/stores/useBookingStore";
import { BookingSelectionCard } from "../../bookings/components/booking-selection-card";

interface VenueSelectionProps {
  onPress: () => void;
}

export const VenueSelection: React.FC<VenueSelectionProps> = ({ onPress }) => {
  const selectedVenue = useBookingStore((state) => state.selectedVenue);

  return (
    <BookingSelectionCard title="Select Venue" justify>
      <TouchableOpacity
        onPress={onPress}
        className="flex-row items-center justify-between"
      >
        <View className="flex-1 pr-4">
          <View className="flex-row items-center">
            {selectedVenue ? (
              <View className="flex-row items-center">
                <MaterialIcons
                  name="location-on"
                  size={20}
                  color="#3B82F6"
                  className="mr-2"
                />
                <Text className="text-gray-700 dark:text-gray-100 font-medium text-base">
                  {selectedVenue.name}
                </Text>
              </View>
            ) : (
              <Text className="text-gray-700 dark:text-gray-100 font-medium text-base">
                Bar/Hotel Name
              </Text>
            )}
          </View>
          <Text className="text-gray-400 dark:text-gray-300 text-sm mt-1 ml-7">
            {selectedVenue
              ? selectedVenue.address
              : "Select venue to continue..."}
          </Text>
        </View>

        <View className="bg-blue-50 p-2 rounded-full">
          <MaterialIcons name="chevron-right" size={24} color="#3B82F6" />
        </View>
      </TouchableOpacity>
    </BookingSelectionCard>
  );
};

export default VenueSelection;
