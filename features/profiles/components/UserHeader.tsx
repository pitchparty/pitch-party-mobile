import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Profile } from '../types';
import UserAvatar from './UserAvatar';

// Default avatar image (replace with your own default image URL or local asset)
const DEFAULT_AVATAR = 'https://example.com/default-avatar.png'; // Replace with an actual default image URL or local asset

interface UserHeaderProps {
  user: Profile;
}

export default function UserHeader({ user }: UserHeaderProps) {
  const getStatusColor = () => {
    if (!user.is_active) return 'bg-gray-400';
    if (user.last_activity) {
      const lastActive = new Date(user.last_activity);
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
      return lastActive > tenMinsAgo ? 'bg-green-500' : 'bg-yellow-400';
    }
    return 'bg-yellow-400';
  };

  const getRoleStyles = () => {
    switch (user.role) {
      case 'admin':
        return 'bg-purple-500 text-white';
      case 'manager':
        return 'bg-blue-500 text-white';
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <View className="bg-white dark:bg-gray-800 p-4 my-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex-row items-center">
      {/* Avatar with Status Indicator */}
      <View className="relative mr-4">
        <UserAvatar
          uri={user.avatar_url || DEFAULT_AVATAR} // Fallback to default avatar
          size={80} // Reduced size for horizontal layout
          className="rounded-full border-2 border-gray-200 dark:border-gray-700"
        />
        <View
          className={`${getStatusColor()} w-5 h-5 rounded-full absolute bottom-1 right-1 border-2 border-white dark:border-gray-800`}
        />
      </View>

      {/* User Info */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-xl font-bold text-gray-900 dark:text-white">
            {user.first_name} {user.last_name}
          </Text>
          <View
            className={`px-2 py-1 rounded-full ${getRoleStyles()}`}
          >
            <Text className="text-xs font-medium capitalize">{user.role}</Text>
          </View>
        </View>

        <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          @{user.username}
        </Text>

        {/* Optional Bio */}
        {user.bio && (
          <Text
            numberOfLines={2}
            className="text-sm text-gray-500 dark:text-gray-400 mt-2"
          >
            {user.bio}
          </Text>
        )}
      </View>
    </View>
  );
}