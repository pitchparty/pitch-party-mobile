import React from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
import colors from 'tailwindcss/colors'; // If you use tailwind colors directly

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
}

const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ message, size = 'large' }) => {
  return (
    <View className="flex-1 justify-center items-center p-4 bg-blue-50 dark:bg-gray-900">
      <ActivityIndicator size={size} color={colors.blue[500]} />
      {message && <Text className="mt-3 text-gray-600 dark:text-gray-400">{message}</Text>}
    </View>
  );
};

export default LoadingIndicator;