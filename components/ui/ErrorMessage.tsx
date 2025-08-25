import React from 'react';
import { View, Text, Button } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

interface ErrorMessageProps {
  message: string;
  error?: Error | null;
  onRetry?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, error, onRetry }) => {
  return (
    <View className="flex-1 justify-center items-center p-6 bg-red-50 dark:bg-gray-800">
      <Ionicons name="warning-outline" size={48} color={colors.red[500]} />
      <Text className="mt-4 text-lg font-semibold text-red-700 dark:text-red-400 text-center">
        {message}
      </Text>
      {error?.message && (
        <Text className="mt-2 text-sm text-red-600 dark:text-red-300 text-center">
          {error.message}
        </Text>
      )}
      {onRetry && (
        <View className="mt-6">
          <Button title="Try Again" onPress={onRetry} color={colors.red[500]} />
        </View>
      )}
    </View>
  );
};

export default ErrorMessage;