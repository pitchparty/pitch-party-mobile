import { Feather } from "@expo/vector-icons";
import { View,Text } from "react-native";

const VenueRating = ({ rating }: { rating: number }) => {
    if (!rating) return <Text className="text-gray-500">No ratings yet</Text>;
    
    return (
      <View className="flex-row items-center">
        <Feather name="star" size={16} color="#FFD700" />
        <Text className="ml-1 text-gray-700">{rating.toFixed(1)}</Text>
      </View>
    );
  };

  export default VenueRating;