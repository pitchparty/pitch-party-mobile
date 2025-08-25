// src/components/molecules/PendingTasksSection.tsx
import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

import { usePendingVenues } from '../hooks';
import colors from 'tailwindcss/colors';
import { router } from 'expo-router';

const PendingTasksSection = () => {
  // Fetch pending venues using the TanStack Query hook
  const { data: pendingTasks, isPending, isError, error, refetch } = usePendingVenues();

  // Helper function to determine priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-600';
      case 'medium':
        return 'bg-orange-100 text-orange-600';
      default:
        return 'bg-blue-100 text-blue-600';
    }
  };

  // Helper function to determine the icon based on task type
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'venue':
        return 'business';
      case 'review':
        return 'star';
      case 'payment':
        return 'card';
      default:
        return 'alert-circle';
    }
  };

  // Render individual task item
  const renderTaskItem = (item: { id: string, action: string, target: string, priority: string, type: string }) => (
    <TouchableOpacity
      key={item.id}
      className="flex-row items-center py-3 border-b border-gray-100"
      onPress={() => router.push(`/venues/venue/${item.id}`)}
    >
      <View className="h-8 w-8 rounded-full bg-gray-100 items-center justify-center mr-3">
        <Ionicons name={getTypeIcon(item.type)} size={16} color="#64748b" />
      </View>
      <View className="flex-1">
        <Text className="text-gray-800">
          {item.action}: <Text className="font-medium">{item.target}</Text>
        </Text>
      </View>
      <View className={`px-2 py-1 rounded-full ${getPriorityColor(item.priority)}`}>
        <Text className="text-xs font-medium">{item.priority}</Text>
      </View>
    </TouchableOpacity>
  );

  // Handle loading state
  if (isPending) {
    return <Text className="text-gray-500 text-center py-4">Loading pending tasks...</Text>;
  }

  // Handle error state
  if (isError) {
    return <Text className="text-red-500 text-center py-4">Error: {error?.message || 'Failed to load tasks.'}</Text>;
  }

  // Handle empty state
  if (!pendingTasks || pendingTasks.length === 0) {
    return ( <View className='justify-center items-center'>
    <Ionicons name='business' size={24} color={colors.gray[300]} />
    <Text className="mt-2 text-gray-500 text-sm">No pending tasks</Text>
  </View>);
  }

  // Render the list of pending tasks
  return (
    <View className="bg-white rounded-xl shadow-sm p-4 mb-4">
      <View>{pendingTasks.map(renderTaskItem)}</View>
    </View>
  );
};

export default PendingTasksSection;