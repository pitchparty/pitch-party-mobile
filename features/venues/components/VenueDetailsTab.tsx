import React from 'react';
import { ScrollView, View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import { Venue } from '../types'; // Import types
import VenueSection from './VenueSection'; // Import reusable section
import colors from 'tailwindcss/colors'; // Import colors
import { UserMetadata } from '@supabase/supabase-js';

interface VenueDetailsTabProps {
  venue: Venue;
  userMetadata: UserMetadata | undefined;
  onStatusChangePress: () => void; // Callback to open status modal
}

const VenueDetailsTab: React.FC<VenueDetailsTabProps> = ({
  venue,
  userMetadata,
  onStatusChangePress,
}) => {

  // Function to render status badge - improved styling
  const renderStatusBadge = () => {
    let bgColor = '';
    let textColor = '';
    switch (venue.status) {
      case 'published':
        bgColor = 'bg-green-100 dark:bg-green-900';
        textColor = 'text-green-700 dark:text-green-300';
        break;
      case 'draft':
        bgColor = 'bg-yellow-100 dark:bg-yellow-900';
        textColor = 'text-yellow-700 dark:text-yellow-300';
        break;
      case 'archived':
        bgColor = 'bg-gray-100 dark:bg-gray-600';
        textColor = 'text-gray-700 dark:text-gray-300';
        break;
    }
    return (
      <View className={`px-3 py-1 rounded-full ${bgColor}`}>
        <Text className={`text-sm font-medium capitalize ${textColor}`}>
          {venue.status}
        </Text>
      </View>
    );
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50 dark:bg-gray-950"
      contentContainerStyle={{ paddingBottom: 100, paddingTop: 16, paddingHorizontal: 16 }}
    >
      {/* Overview Section */}
      <VenueSection title={venue.name} iconName="information-circle-outline">
         {userMetadata?.role !== 'user' && (
            <View className="flex-row justify-between items-center mb-4">
              {renderStatusBadge()}
              <TouchableOpacity
                className="bg-blue-500 px-4 py-2 rounded-lg shadow-sm"
                onPress={onStatusChangePress}
              >
                <Text className="text-white text-sm font-semibold">Change Status</Text>
              </TouchableOpacity>
            </View>
         )}

        {venue.average_rating && (
          <View className="flex-row items-center mb-3">
            <Ionicons name="star" size={18} color={colors.yellow[500]} />
            <Text className="ml-1.5 text-base text-gray-700 dark:text-gray-300">
              {venue.average_rating.toFixed(1)}
            </Text>
          </View>
        )}
        <Text className="text-base text-gray-600 dark:text-gray-400 leading-relaxed">
          {venue.description || 'No description available.'}
        </Text>
      </VenueSection>

      {/* Key Info Section */}
      <VenueSection title="Key Information" iconName="list-outline">
        <View className="space-y-4">
           <View className="flex-row items-center">
             <Ionicons name="people-outline" size={20} color={colors.gray[500]} className="mr-3" />
             <Text className="text-base text-gray-700 dark:text-gray-300">
               Capacity: {venue.capacity ?? 'N/A'}
             </Text>
           </View>
           <View className="flex-row items-start">
             <Ionicons name="location-outline" size={20} color={colors.gray[500]} className="mr-3 mt-0.5" />
             <Text className="text-base text-gray-700 dark:text-gray-300 flex-1">
               {venue.address}
             </Text>
           </View>
          {/* Conditionally show contact info */}
           {userMetadata?.role !== 'user' && venue.contact_phone && (
              <View className="flex-row items-center">
                <Ionicons name="call-outline" size={20} color={colors.gray[500]} className="mr-3" />
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {venue.contact_phone}
                </Text>
              </View>
           )}
           {venue.contact_email && (
              <View className="flex-row items-center">
                <Ionicons name="mail-outline" size={20} color={colors.gray[500]} className="mr-3" />
                <Text className="text-base text-gray-700 dark:text-gray-300">
                  {venue.contact_email}
                </Text>
              </View>
           )}
        </View>
      </VenueSection>

      {/* Amenities Section */}
      {venue.amenities && venue.amenities.length > 0 && (
        <VenueSection title="Amenities" iconName="sparkles-outline">
          <View className="flex-row flex-wrap gap-2">
            {venue.amenities.map((amenity, index) => (
              <View
                key={index}
                className="bg-blue-100 dark:bg-blue-900/50 px-3 py-1.5 rounded-full"
              >
                <Text className="text-blue-800 dark:text-blue-300 text-sm font-medium">
                  {amenity}
                </Text>
              </View>
            ))}
          </View>
        </VenueSection>
      )}

      {/* Map Section */}
      {venue.latitude && venue.longitude && (
         <VenueSection title="Location" iconName="map-outline">
             <View className="overflow-hidden rounded-xl">
                 <MapView
                    style={{ width: '100%', height: 250 }} // Slightly larger map
                    initialRegion={{
                      latitude: venue.latitude,
                      longitude: venue.longitude,
                      latitudeDelta: 0.01,
                      longitudeDelta: 0.01,
                    }}
                    pitchEnabled={false}
                    rotateEnabled={false}
                    scrollEnabled={false} // Consider disabling scroll if not needed
                    zoomEnabled={false}
                 >
                    <Marker
                      coordinate={{
                        latitude: venue.latitude,
                        longitude: venue.longitude,
                      }}
                      title={venue.name}
                      description={venue.address}
                      pinColor={colors.blue[500]} // Custom pin color
                    />
                 </MapView>
             </View>
         </VenueSection>
      )}
    </ScrollView>
  );
};

export default VenueDetailsTab;
