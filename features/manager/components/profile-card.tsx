import React from 'react';
import { View, Text, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuthStore } from '@/features/authentication/store';

export default function ProfileCard() {
  const user = useAuthStore(state => state.user)
  const profile = {
    firstName: "Alex",
    lastName: "Johnson",
    username: "@alexj",
    totalVenues: 42,
    isActive: true,
    nowShowing: "Arsenal vs Manchester United",
    venue: "Emirates Stadium"
  };

  return (
    <View className="w-full">
      <View className="rounded-lg overflow-hidden bg-white dark:bg-gray-800 shadow-md border border-gray-200">
      <Image
          source={
            user?.avatar_url
              ? { uri: user?.avatar_url }
              : require('../../../assets/images/blue_logo.png')
          }
          className="w-16 h-16 rounded-full bg-gray-200"
          style={{
            width: 40,
            height: 40,
          }}
          defaultSource={require('../../../assets/images/blue_logo.png')}
        />
        
        {/* Profile Info */}
        <View className="px-6 py-4">
          {/* Name and Active Status */}
          <View className="flex flex-row items-center justify-center mb-2">
            <Text className="text-xl font-bold text-gray-800 dark:text-white">{profile.firstName} {profile.lastName}</Text>
            {profile.isActive && (
              <Ionicons name="checkmark-circle" size={18} color="#10B981" style={{ marginLeft: 6 }} />
            )}
          </View>
          
          {/* Username */}
          <Text className="text-gray-500 dark:text-gray-400 text-center text-sm mb-4">{profile.username}</Text>
          
          {/* Stats with divider */}
          <View className="flex flex-row justify-center items-center py-2 mb-4 border-t border-b border-gray-100 dark:border-gray-700">
            <View className="flex flex-row items-center">
              <Ionicons name="location-outline" size={16} color="#3B82F6" style={{ marginRight: 6 }} />
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">{profile.totalVenues} Venues</Text>
            </View>
            <View className="mx-4 h-5 border-r border-gray-200 dark:border-gray-700"></View>
            <View className="flex flex-row items-center">
              <Ionicons name="calendar-outline" size={16} color="#3B82F6" style={{ marginRight: 6 }} />
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">Member</Text>
            </View>
          </View>
          
          {/* Now Showing Section */}
          <View className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
            <View className="flex flex-row items-center mb-2">
              <Ionicons name="play-circle-outline" size={16} color="#EF4444" style={{ marginRight: 6 }} />
              <Text className="text-xs uppercase font-bold text-gray-500 dark:text-gray-400">Now Showing</Text>
            </View>
            <View className="flex flex-row items-center justify-between mb-2">
              <Text className="font-medium text-gray-800 dark:text-white text-sm">{profile.nowShowing}</Text>
              <View className="h-2.5 w-2.5 rounded-full bg-red-500 animate-pulse"></View>
            </View>
            <View className="flex flex-row items-center">
              <Ionicons name="location-outline" size={14} color="#6B7280" style={{ marginRight: 4 }} />
              <Text className="text-xs text-gray-500 dark:text-gray-400">{profile.venue}</Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}