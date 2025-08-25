import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, View, TouchableOpacity, Text, StyleSheet } from "react-native";

import { useEventsDay } from "../hooks/useEventsDay";


const SportSelectionModal = ({ visible, onClose, onSelect }: any) => {
  const { data, isPending, isError, error } = useEventsDay();

  if (!visible) return null;

  if (isPending) return <ActivityIndicator />;

  if (isError) return <Text>Error: {error.message}</Text>;

  if (!data) return <Text>No data</Text>;

  return (
    <View style={styles.modalOverlay}>
      {/* Modal Container */}
      <View className="bg-white w-4/5 rounded-xl p-4 max-h-[80%] overflow-y-auto">
        {/* Header */}
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold">Select Game</Text>
          <TouchableOpacity onPress={onClose}>
            <MaterialIcons name="close" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* List of Games */}
        {data.map((sport) => (
          <TouchableOpacity
            key={sport.idEvent}
            className="p-3 border-b border-gray-200"
            onPress={() => {
              onSelect(sport);
              onClose();
            }}
          >
            <Text className="text-base font-medium">{sport.strHomeTeam} vs {sport.strAwayTeam}</Text>
            <Text className="text-sm text-gray-500">
              Starting: {sport.dateEvent} @ {sport.strTime}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default SportSelectionModal;

const styles = StyleSheet.create({
  modalOverlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent black background
    flex: 1,
    justifyContent: 'center', // Center vertically
    alignItems: 'center', // Center horizontally
    zIndex: 10, // Optional: Explicitly set zIndex if needed
  },
});