import React, { useCallback } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, View, Text } from "react-native";
import { BottomSheetBackdrop, BottomSheetBackdropProps, BottomSheetScrollView } from "@gorhom/bottom-sheet";

import { useActiveVenues } from "@/features/venues/hooks";
import { VenueWithManager } from "@/features/venues/types";
import StatusStateView from "@/components/ui/StatusStateView";

interface VenueBottomSheetProps {
  onSelect: (venue: VenueWithManager) => void;
}

export const VenueBottomSheet: React.FC<VenueBottomSheetProps> = ({
  onSelect,
}) => {
  const { data, isPending, isError, error } = useActiveVenues();



  const VenueItem = React.memo(
    ({
      venue,
      onSelect,
    }: {
      venue: VenueWithManager;
      onSelect: (venue: VenueWithManager) => void;
    }) => (
      <TouchableOpacity
        key={venue.id}
        onPress={() => onSelect(venue)}
        className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl p-4 mb-3 mx-4 flex-row items-center justify-between shadow-sm"
      >
        <View className="flex-row items-center">
          <MaterialIcons name="location-on" size={24} color="#3B82F6" />
          <View className="ml-4">
            <Text className="font-semibold text-gray-700 dark:text-gray-100">
              {venue.name}
            </Text>
            <Text className="text-gray-500 dark:text-gray-300 text-sm">
              {venue.address}
            </Text>
            <Text className="text-gray-400 dark:text-gray-400 text-xs">
              Capacity: {venue.capacity}
            </Text>
          </View>
        </View>
        <MaterialIcons name="chevron-right" size={24} color="#9CA3AF" />
      </TouchableOpacity>
    )
  );

  return (
    <BottomSheetScrollView  className="bg-blue-50 dark:bg-gray-800 pb-12">
      <View className="h-6" />
      {isPending && (
        <StatusStateView status="pending" message="Searching for venues..." />
      )}
      {data?.length === 0 && (
        <StatusStateView status="empty" message="No venues found." />
      )}
      {data?.map((venue) => (
        <VenueItem key={venue.id} venue={venue} onSelect={onSelect} />
      ))}
      {isError && (
        <StatusStateView status="error" message="Failed to load venues." error={error} />
      )}
      <View className="h-6" />
    </BottomSheetScrollView>
  );
};

export default VenueBottomSheet;