import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { format, isToday, isYesterday } from 'date-fns';
import { View, Text, TouchableOpacity } from 'react-native';

import { Profile } from '../types';
import UserAvatar from './UserAvatar';
import { DEFAULT_AVATAR_URL } from '@/constants/constants';

interface UserListItemProps {
  user: Profile;
  onPress: () => void;
  showLastActivity?: boolean;
}

export default function UserListItem({ 
  user, 
  onPress, 
  showLastActivity = true 
}: UserListItemProps) {
  const formatLastActivity = (timestamp: string | null | undefined) => {
    if (!timestamp) return 'Never active';
    const date = new Date(timestamp);
    return isToday(date) ? `Today, ${format(date, 'h:mm a')}` :
           isYesterday(date) ? `Yesterday, ${format(date, 'h:mm a')}` :
           format(date, 'MMM d, yyyy');
  };

  const getStatusColor = () => {
    if (!user.is_active) return 'bg-gray-100';
    if (user.last_activity) {
      const lastActive = new Date(user.last_activity);
      const tenMinsAgo = new Date(Date.now() - 10 * 60 * 1000);
      return lastActive > tenMinsAgo ? 'bg-green-100' : 'bg-yellow-100';
    }
    return 'bg-yellow-100';
  };


  const getRoleStyles = () => {
    switch(user.role) {
      case 'user': return 'bg-red-100 text-red-800';
      case 'manager': return 'bg-blue-100 text-blue-800';
      default: return 'hidden';
    }
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      className="flex-row items-center p-3 bg-white dark:bg-gray-800 rounded-lg mb-2 shadow-sm border border-gray-100 dark:border-gray-700"
    >
      {/* Avatar Container */}
      <View className="relative mr-2">
        <UserAvatar 
          uri={user.avatar_url ?? DEFAULT_AVATAR_URL}
          size={48}
          className="rounded-full border border-gray-200 dark:border-gray-700"
        />
        <View className={`${getStatusColor()} w-3 h-3 rounded-full absolute bottom-0 border-2 border-white dark:border-gray-800`} />
      </View>

      {/* User Info */}
      <View className="flex-1">
        <View className="flex-row items-center justify-between">
          <Text className="text-base font-semibold text-gray-900 dark:text-white">
            {user.first_name} {user.last_name}
          </Text>
          <View className={`px-2 py-0.5 rounded-full ${getRoleStyles()}`}>
            <Text className="text-xs font-medium capitalize">{user.role}</Text>
          </View>
        </View>

        <Text className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
          @{user.username}
        </Text>

        {showLastActivity && (
          <View className="flex-row items-center mt-1">
            <Text className="text-xs text-gray-500 dark:text-gray-400 ml-1">
              {formatLastActivity(user.last_activity)}
            </Text>
          </View>
        )}
      </View>

      {/* Chevron */}
      <Ionicons 
        name="chevron-forward" 
        size={20} 
        color="#6B7280" 
        className="ml-2"
      />
    </TouchableOpacity>
  );
}