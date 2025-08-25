import { Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { MaterialIcons } from '@expo/vector-icons'
import { router } from 'expo-router'

const HeaderRight = () => {
  return (
    <TouchableOpacity
    onPress={() => router.navigate("/notifications")}
    className="mr-4 relative"
  >
    <MaterialIcons name="notifications" size={28} color="white" />
    <View className="absolute -top-2 -right-2 bg-red-500 rounded-full w-6 h-6 items-center justify-center">
      <Text className="text-white text-xs font-bold">3</Text>
    </View>
  </TouchableOpacity>
  )
}

export default HeaderRight