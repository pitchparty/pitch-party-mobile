import React from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { VenueWithManager } from "@/features/venues/types";
import { MatchSelection } from "@/features/bookings/components/match-selection";
import { VenueSelection } from "@/features/venues/components/venue-selection";
import { BookingSelectionCard } from "@/features/bookings/components/booking-selection-card";

interface BookingFormProps {
  ticketCount: number;
  setTicketCount: (count: number) => void;
  specialRequests: string;
  setSpecialRequests: (text: string) => void;
  onMatchSelect: () => void;
  onVenueSelect: () => void;
  selectedVenue?: VenueWithManager;
}

const BookingForm = ({
  ticketCount,
  setTicketCount,
  specialRequests,
  setSpecialRequests,
  onMatchSelect,
  onVenueSelect,
  selectedVenue,
}: BookingFormProps) => (
  <ScrollView
    className="flex-1 bg-blue-50 dark:bg-gray-900 px-4 py-4"
    contentContainerStyle={{ paddingBottom: 100 }}
  >
    <MatchSelection onPress={onMatchSelect} />
    <VenueSelection onPress={onVenueSelect} />
    <View className="flex-row justify-between items-center">
      <BookingSelectionCard title="Select Tickets" className="h-32 w-44">
        <View className="flex-row items-center justify-center">
          <TouchableOpacity
            onPress={() => setTicketCount(Math.max(1, ticketCount - 1))}
            className="bg-blue-100 rounded-lg p-2"
          >
            <MaterialIcons name="remove" size={20} color="blue" />
          </TouchableOpacity>
          <Text className="mx-4 text-lg font-semibold text-blue-900 dark:text-gray-300">
            {ticketCount}
          </Text>
          <TouchableOpacity
            onPress={() => setTicketCount(ticketCount + 1)}
            className="bg-blue-100 rounded-lg p-2"
          >
            <MaterialIcons name="add" size={20} color="blue" />
          </TouchableOpacity>
        </View>
      </BookingSelectionCard>
      <BookingSelectionCard
        title="Total"
        className="h-32 w-44"
        redemptionOption={selectedVenue?.redemption_option}
      >
        <Text className="text-black dark:text-gray-200">KES</Text>
        <Text className="text-lg text-black font-semibold dark:text-gray-200">
          {Number(
            Number(selectedVenue?.pricing || 0) * ticketCount
          ).toLocaleString()}
        </Text>
      </BookingSelectionCard>
    </View>
    <BookingSelectionCard title="Special Request">
      <ThemedTextInput
        placeholder="Any special requests?"
        multiline
        value={specialRequests}
        onChangeText={setSpecialRequests}
      />
    </BookingSelectionCard>
  </ScrollView>
);

export default BookingForm;
