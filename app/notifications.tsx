import { MaterialIcons } from '@expo/vector-icons'
import { useNavigation } from 'expo-router'
import React, {  useEffect, useState } from 'react'
import { Text, View, ScrollView, Pressable, StyleSheet } from 'react-native'
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect'


type NotificationType = {
  id: string
  type: 'match' | 'promo' | 'update'
  title: string
  message: string
  time: string
  read: boolean
}

const NotificationScreen = () => {
    const navigation = useNavigation();

    useIsomorphicLayoutEffect(() => {
      navigation.setOptions({
        headerShown: true,
        title: "Notifications"
      })
    },[navigation]);
    

    const [hasPermission, setHasPermission] = useState(false);
  

  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: '1',
      type: 'match',
      title: 'Match Starting Soon!',
      message: 'Your match at Pitch A starts in 30 minutes',
      time: '30m ago',
      read: false
    },
    {
      id: '2',
      type: 'promo',
      title: 'Weekend Special Offer',
      message: 'Book any pitch this weekend and get 20% off',
      time: '2h ago',
      read: false
    },
    {
      id: '3',
      type: 'update',
      title: 'New Match Added',
      message: 'A new match has been scheduled for next week',
      time: '1d ago',
      read: true
    },
  ])



  const markAllAsRead = () => {
    setNotifications(notifications.map(notif => ({ ...notif, read: true })))
  }

  const getNotificationColor = (type: NotificationType['type']) => {
    switch (type) {
      case 'match':
        return 'border-blue-500'
      case 'promo':
        return 'border-green-500'
      case 'update':
        return 'border-yellow-500'
    }
  }

  return (
      <ScrollView className="flex-1 bg-blue-50 dark:bg-gray-900">
        {/* Create an empty notification illustration using expo icons ionicons */}
        <View className="flex-1 items-center justify-center">
          <MaterialIcons name="notifications-off" size={48} color="#4B5563" />
          <Text className="text-gray-600 dark:text-gray-400">No notifications yet</Text>
        </View>
      </ScrollView>
  )
}

export default NotificationScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  permissionContainer: {
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  permissionText: {
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '600',
  },
  optionsContainer: {
    marginTop: 8,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  optionLabel: {
    fontSize: 16,
  },
});