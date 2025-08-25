import React from 'react'
import { View } from 'react-native'

interface CardProps {
    children: React.ReactNode;
    className?: string;
}

const Card = ({children, className }: CardProps) => {
  return (
    <View className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-2 ${className || ''}`}>
        {children}
    </View>
  )
}

export default Card;