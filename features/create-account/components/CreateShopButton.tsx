import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';

interface CreateShopButtonProps {
  onPress: () => void;
}

const CreateShopButton: React.FC<CreateShopButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity 
      className="mt-4 bg-white rounded-xl p-4 shadow-sm"
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View className="flex-row items-center">
        <View className="w-10 h-10 bg-blue-100 rounded-full items-center justify-center">
          <FontAwesome name="plus" size={16} color="#3b82f6" />
        </View>
        
        <View className="ml-4 flex-1">
          <Text className="text-lg font-semibold">Create New Shop</Text>
          <Text className="text-gray-500">Set up a new shop for your business</Text>
        </View>
        
        <FontAwesome name="chevron-right" size={16} color="#9ca3af" />
      </View>
    </TouchableOpacity>
  );
};

export default CreateShopButton;