import { View, Text } from "react-native";
import { Venue } from "../types";


const VenueStatusBadge = ({ status }: { status: Venue['status'] }) => {
    const getStatusStyle = () => {
      switch (status) {
        case 'published':
          return 'bg-green-100 text-green-800';
        case 'draft':
          return 'bg-yellow-100 text-yellow-800';
        case 'archived':
          return 'bg-gray-100 text-gray-800';
        default:
          return 'bg-gray-100 text-gray-800';
      }
    };
  
    return (
      <View className={`rounded-full px-2 py-1 ${getStatusStyle()}`}>
        <Text className="text-xs font-medium capitalize">{status}</Text>
      </View>
    );
  };

export default VenueStatusBadge;