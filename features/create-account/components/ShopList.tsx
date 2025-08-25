import React from 'react';
import { View, Text, FlatList } from 'react-native';
import ShopItem from './ShopItem';

interface ShopListProps {
  shops: any[];
}

const ShopList: React.FC<ShopListProps> = ({ shops }) => {
  if (shops.length === 0) {
    return (
      <View className="py-8 items-center">
        <Text className="text-gray-500">You don't have any shops yet</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={shops}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ShopItem shop={item} />}
      ItemSeparatorComponent={() => <View className="h-px bg-gray-200 my-2" />}
      scrollEnabled={false}
    />
  );
};

export default ShopList;