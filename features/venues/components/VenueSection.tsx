import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Ensure Ionicons is imported
import colors from 'tailwindcss/colors';

interface VenueSectionProps {
  title: string;
  iconName?: React.ComponentProps<typeof Ionicons>['name']; // Optional icon name
  children: React.ReactNode;
  containerClassName?: string; // Allow custom styling for the container
}

const VenueSection: React.FC<VenueSectionProps> = ({
  title,
  iconName,
  children,
  containerClassName = '',
}) => {
  return (
    <View
      className={`bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-md mb-6 ${containerClassName}`}
    >
      <View className="flex-row items-center mb-4">
         {iconName && (
            <Ionicons
                name={iconName}
                size={22}
                color={colors.blue[600]} // Use a consistent icon color
                className="mr-3"
            />
         )}
        <Text className="text-xl font-semibold text-gray-800 dark:text-gray-100">
          {title}
        </Text>
      </View>
      {children}
    </View>
  );
};

export default VenueSection;