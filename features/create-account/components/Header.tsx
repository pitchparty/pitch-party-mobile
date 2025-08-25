import React from 'react';
import { View, Text } from 'react-native';

interface CreateAccountHeaderProps {
    title: string;
    subtitle: string;
}

const CreateAccountHeader = ({ title, subtitle }: CreateAccountHeaderProps) => (
  <View className="mb-4 mt-4">
    <Text className="text-3xl font-bold mb-2">{title}</Text>
    <Text className="text-gray-500">{subtitle}</Text>
  </View>
);

export default CreateAccountHeader;