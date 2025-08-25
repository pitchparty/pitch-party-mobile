import React from 'react';
import colors from 'tailwindcss/colors';
import { Ionicons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity } from 'react-native';

interface SectionHeaderProps {
  title: string;
  description?: string;
  onPressViewAll?: () => void;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, description, onPressViewAll }) => {
  return (
    <View className="flex-row items-center justify-between my-4">
      <View>
        <Text className="text-xl font-bold text-black dark:text-gray-300">{title}</Text>
        {description && (
          <Text className="text-gray-500 dark:text-gray-400 text-sm">{description}</Text>
        )}
      </View>
      {onPressViewAll && (
        <TouchableOpacity className="flex-row items-center justify-center" onPress={onPressViewAll}>
          <Text className="text-blue-500 mr-2">View All</Text>
          <Ionicons name="chevron-forward" size={14} color={colors.blue[500]} />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SectionHeader;
