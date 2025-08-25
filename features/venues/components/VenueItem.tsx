import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import ShimmerPlaceholder from "react-native-shimmer-placeholder";

import { VenueWithManager } from "@/features/venues/types";

// Placeholder image to use when no photos are available
const PLACEHOLDER_IMAGE =
  "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg";

const VenueItem = ({
  venue,
  isLoading,
}: {
  venue: VenueWithManager | undefined;
  isLoading?: boolean;
}) => {
  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  const getAmenityIcon = (amenity: keyof typeof Ionicons.glyphMap) => {
    const amenityMap = {
      wifi: { icon: "wifi", color: "#3B82F6" },
      parking: { icon: "car", color: "#10B981" },
      food: { icon: "fast-food", color: "#F59E0B" },
      bar: { icon: "beer", color: "#8B5CF6" },
      "live music": { icon: "musical-notes", color: "#EC4899" },
    };
    return (
      // @ts-ignore
      amenityMap[amenity.toLocaleLowerCase] || {
        icon: "pricetag",
        color: "#6B7280",
      }
    );
  };

  return (
    <TouchableOpacity
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-md overflow-hidden mb-4"
      onPress={() => venue && router.push(`/venues/venue/${venue?.id}`)}
      disabled={isLoading}
    >
      {/* Image Section */}
      {/* <View className="relative">
        {isLoading ? (
          <ShimmerPlaceholder style={styles.image} />
        ) : (
          <Image
            source={venueImage}
            placeholder={blurhash}
            transition={300}
            style={{ width: "100%", height: 192 }}
            contentFit="cover"
          />
        )}

        {!isLoading && venue?.pricing && (
          <View className="absolute top-3 right-4 bg-blue-500 px-3 py-1 my-2 rounded-full">
            <Text className="text-white font-bold text-sm">
              {venue?.pricing}
            </Text>
          </View>
        )} 
        {!isLoading && !venue?.is_active && (
          <View className="absolute inset-0 bg-black bg-opacity-60 items-center justify-center">
            <Text className="text-white font-bold text-lg">Not Available</Text>
          </View>
        )}
      </View>*/}


      {/* Info Section */}
      <View className="p-4">
        {/* Name & Location */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1 mr-2">
            {isLoading ? (
              <ShimmerPlaceholder style={styles.title} />
            ) : (
              <Text className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {venue?.name}
              </Text>
            )}
            <View className="flex-row items-center mt-1">
              <MaterialIcons name="location-on" size={16} color="#3B82F6" />
              {isLoading ? (
                <ShimmerPlaceholder style={styles.textLine} />
              ) : (
                <Text className="text-gray-600 dark:text-gray-400 ml-1 text-sm flex-shrink">
                  {venue?.address}
                </Text>
              )}
            </View>
          </View>
          {!isLoading &&
            venue?.average_rating &&
            renderStars(venue?.average_rating)}
        </View>

        {/* Description */}
        {isLoading ? (
          <ShimmerPlaceholder style={styles.description} />
        ) : (
          venue?.description && (
            <Text
              className="text-gray-700 dark:text-gray-300 text-sm mt-2"
              numberOfLines={2}
            >
              {venue?.description}
            </Text>
          )
        )}

        {/* Amenities */}
         {/* @ts-ignore */}
        {!isLoading && venue?.amenities?.length! > 0 && (
          <View className="flex-row flex-wrap mt-3">
             {/* @ts-ignore */}
            {venue?.amenities!.slice(0, 4).map((amenity, index) => {
              // @ts-ignore
              const { icon, color } = getAmenityIcon(amenity);
              return (
                <View
                  key={index}
                  className="flex-row items-center bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 mr-2 mb-2"
                >
                  <Ionicons name={icon} size={12} color={color} />
                  <Text className="text-gray-700 dark:text-gray-300 text-xs ml-1">
                    {amenity}
                  </Text>
                </View>
              );
            })}
            {/* @ts-ignore */}
            {venue?.amenities!.length > 4 && (
              <View className="bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-1 mr-2 mb-2">
                <Text className="text-gray-700 dark:text-gray-300 text-xs">
                {/* @ts-ignore */}
                  +{venue?.amenities!.length - 4} more
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Capacity & Details Link */}
        <View className="flex-row justify-between items-center mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
          <View className="flex-row items-center">
            <Ionicons name="people" size={16} color="#3B82F6" />
            {isLoading ? (
              <ShimmerPlaceholder style={styles.textLine} />
            ) : (
              <Text className="text-gray-700 dark:text-gray-300 ml-1 text-sm">
                {venue?.capacity
                  ? `Up to ${venue?.capacity}`
                  : "Contact for capacity"}
              </Text>
            )}
          </View>
          {!isLoading && (
            <View className="flex-row items-center">
              <Text className="text-blue-500 dark:text-blue-400 text-sm font-medium mr-1">
                View Details
              </Text>
              <MaterialIcons
                name="arrow-forward-ios"
                size={14}
                color="#3B82F6"
              />
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const renderStars = (rating: number) => (
  <View className="flex-row">
    {Array.from({ length: 5 }, (_, index) => (
      <MaterialIcons
        key={index}
        name={
          index < Math.floor(rating)
            ? "star"
            : index < rating
            ? "star-half"
            : "star-outline"
        }
        size={16}
        color="#FFD700"
      />
    ))}
    <Text className="ml-1 text-gray-600 dark:text-gray-400 text-sm">
      ({rating.toFixed(1)})
    </Text>
  </View>
);

const styles = StyleSheet.create({
  image: { width: "100%", height: 192, borderRadius: 12 },
  title: { width: "60%", height: 20, borderRadius: 4 },
  textLine: { width: "80%", height: 14, borderRadius: 4, marginTop: 4 },
  description: { width: "100%", height: 32, borderRadius: 4, marginTop: 8 },
});

export default VenueItem;
