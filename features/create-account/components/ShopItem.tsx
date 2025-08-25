import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

interface ShopItemProps {
  shop: {
    id: string;
    name: string;
    is_approved: boolean;
    is_active: boolean;
  };
}

const ShopItem: React.FC<ShopItemProps> = ({ shop }) => {
  const handlePress = () => {
    // Navigate to shop details
  };

  return (
    <TouchableOpacity 
      className="py-3" 
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View className="flex-row justify-between items-center">
        <View className="flex-1">
          <Text className="text-lg font-medium">{shop.name}</Text>
          
          <View className="flex-row mt-1">
            <View className={`px-2 py-0.5 rounded mr-2 ${shop.is_approved ? 'bg-green-100' : 'bg-yellow-100'}`}>
              <Text className={`text-xs ${shop.is_approved ? 'text-green-800' : 'text-yellow-800'}`}>
                {shop.is_approved ? 'Approved' : 'Pending Approval'}
              </Text>
            </View>
            
            <View className={`px-2 py-0.5 rounded ${shop.is_active ? 'bg-blue-100' : 'bg-gray-100'}`}>
              <Text className={`text-xs ${shop.is_active ? 'text-blue-800' : 'text-gray-800'}`}>
                {shop.is_active ? 'Active' : 'Inactive'}
              </Text>
            </View>
          </View>
        </View>
        
        <Text className="text-blue-500">View →</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ShopItem;