import React from 'react';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, Text, ActivityIndicator } from 'react-native';

interface NotificationBellProps {
  count?: number;
  isLoading?: boolean;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ count = 0, isLoading = false }) => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const iconColor = colorScheme === 'dark' ? 'white' : 'white';

  return (
    <TouchableOpacity
      onPress={() => router.push('/notifications')}
      className="mr-4 relative"
      accessible
      accessibilityLabel="Notifications"
    >
      <Ionicons name="notifications" size={26} color={iconColor} />
      
      {isLoading ? (
        <View className="absolute -top-2 -right-2 w-6 h-6 items-center justify-center">
          <ActivityIndicator size="small" color="red" />
        </View>
      ) : count > 0 && (
        <View className="absolute -top-2 -right-2 bg-red-500 rounded-full items-center justify-center" style={{ width: 20, height: 20 }}>
          <Text className="text-white text-sm font-bold">
            {count > 99 ? '99+' : count}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default NotificationBell;
