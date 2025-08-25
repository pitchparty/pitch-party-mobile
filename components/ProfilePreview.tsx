import React from 'react';
import { Image } from 'expo-image';
import { View, Text, TouchableOpacity, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useAuthStore } from '@/features/authentication/store';
import { DEFAULT_AVATAR_URL } from '@/constants/constants';

const ProfilePreview = () => {
  const user = useAuthStore(state => state.user)

  const blurhash = "LKO2:N%2Tw=w]~RBVZRi};RPxuwH";

  return (
    <View className="bg-white dark:bg-gray-800 p-6 mt-6 rounded-3xl shadow-sm">
      {/* Profile section */}
      <View className="items-center">
        <View className="relative">
          <Image
            source={{ uri: user?.avatar_url || DEFAULT_AVATAR_URL }}
            placeholder={blurhash}
            contentFit="contain"
            transition={1000}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
            }}
          />
        </View>

        <Text className="text-xl font-bold text-gray-900 dark:text-gray-100 mt-4">
          {user?.first_name + " " + user?.last_name || user?.email_address?.split("@")[0]}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 mb-2">
          @{user?.username}
        </Text>
      </View>
    </View>
  );
};

export default ProfilePreview;