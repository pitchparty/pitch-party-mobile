import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

import { BookingItem } from "@/features/bookings/types";
import { useAuthStore } from "@/features/authentication/store";
import getStatusStyles from "@/features/bookings/utils/getStatusStyles";

interface BookingListItemProps extends TouchableOpacityProps {
  item: BookingItem;
}

const BookingListItem = ({ item, ...props }: BookingListItemProps) => {
  const user = useAuthStore((state) => state.user);
  const { bg, text, label } = getStatusStyles(item.status);
  
  return (
    <TouchableOpacity
      className="bg-white dark:bg-gray-700 rounded-xl shadow-sm mb-3 overflow-hidden"
      activeOpacity={1}
      {...props}
    >
      <View className="p-4">
        <View className="flex-row justify-between items-start">
          <View>
            <Text className="text-gray-500 dark:text-gray-400 text-xs">
              BOOKING {item.booking_code}
            </Text>
           <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mt-1">
              {user?.user_metadata.role === "manager" || user?.user_metadata.role === "admin" ? item.user?.first_name + " " + item.user?.last_name : `${item.home_team} vs ${item.away_team}`}
            </Text>
          </View>
          <View className={`px-2 py-1 rounded-full ${bg}`}>
            <Text className={`text-xs font-medium ${text}`}>{label}</Text>
          </View>
        </View>

       {user?.user_metadata.role !== "user" && <View className="mt-3">
          <Text className="text-gray-700 dark:text-gray-400 text-sm font-medium">
            {item.home_team} vs {item.away_team}
          </Text>
        </View>}

        <View className="flex-row items-center mt-3">
          <Ionicons name="business-outline" size={16} color="#64748b" />
          <Text className="text-gray-700 dark:text-gray-400 ml-2">
            {item.venues?.name}
          </Text>
        </View>

        <View className="flex-row justify-between mt-3">
          <View className="flex-row items-center">
            <Ionicons name="calendar-outline" size={16} color="#64748b" />
            <Text className="text-gray-700 dark:text-gray-400 ml-2">
              {item.event_date}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="time-outline" size={16} color="#64748b" />
            <Text className="text-gray-700 dark:text-gray-400 ml-2">
              {item.event_time}
            </Text>
          </View>
          <View className="flex-row items-center">
            <Ionicons name="people-outline" size={16} color="#64748b" />
            <Text className="text-gray-700 dark:text-gray-400 ml-2">
              {item.party_size} guests
            </Text>
          </View>
        </View>

        <View className="mt-3 pt-3 border-t border-gray-100 flex-row justify-between items-center">
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            <Text className="font-medium">
              KES {Number(item.amount).toLocaleString()}
            </Text>
          </Text>
          <Text className="text-sm text-blue-500 dark:text-blue-400">
            View Details
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default BookingListItem;
