import React from 'react'
import { StyleSheet, Text, View } from 'react-native'


interface SectionTitleProps {
    title: string
    description?: string
}

const SectionTitle = ({ title, description }: SectionTitleProps) => {
  return (
    <View className="px-4 mb-2">
    <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">{title}</Text>
    <Text className="text-sm text-gray-500 dark:text-gray-400">{description}</Text>
  </View>
  )
}

export default SectionTitle;