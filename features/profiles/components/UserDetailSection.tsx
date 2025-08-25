import React from 'react';
import colors from 'tailwindcss/colors';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface DetailItem {
  label: string;
  value?: string | null;
}

interface UserDetailSectionProps {
  title: string;
  details: DetailItem[];
}

export default function UserDetailSection({ 
  title, 
  details 
}: UserDetailSectionProps) {
  const filteredDetails = details.filter(detail => detail.value);

  return (
    <View className="bg-white dark:bg-gray-800 rounded-lg p-4 mb-4">
      <Text className="text-lg font-semibold text-gray-700 dark:text-gray-100 mb-3">
        {title}
      </Text>
      {filteredDetails.length === 0 && (
        <View className='justify-center items-center'>
          <Ionicons name='file-tray' size={24} color={colors.gray[300]} />
          <Text className="mt-2 text-gray-500 dark:text-gray-400 text-sm">No details available</Text>
        </View>
      )}
      {filteredDetails.map((detail, index) => (
        <View 
          key={index} 
          className="flex-row justify-between mb-3 pb-2"
        >
          <Text className="text-gray-600 dark:text-gray-400">{detail.label}</Text>
          <Text className="text-gray-800 dark:text-gray-100 font-medium">{detail.value}</Text>
        </View>
      ))}
    </View>
  );
}