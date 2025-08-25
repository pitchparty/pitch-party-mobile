import React from "react";
import { useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, ScrollView } from "react-native";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";

import MenuSection from "@/components/MenuSection";
import ProfilePreview from "@/components/ProfilePreview";
import { useAuthStore } from "@/features/authentication/store";
import { accountSettings, generalSettings } from "@/constants/settings";

const ProfileScreen = () => {
  const navigation = useNavigation();

  const logout = useAuthStore((state) => state.logout);

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
    });
  }, [navigation]);

  return (
    <ScrollView className="flex-1 px-4 bg-blue-50 dark:bg-gray-900">
      {/* Profile Header */}
      <ProfilePreview />

      {/* Menu Sections */}
      <MenuSection title="Account Settings" items={accountSettings} />
      <MenuSection title="General" items={generalSettings} />

      {/* Logout Button */}
      <TouchableOpacity
        className="mx-4 mt-6 mb-8 bg-red-50 py-4 rounded-xl flex-row items-center justify-center border border border-red-500"
        onPress={logout}
      >
        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        <Text className="ml-2 text-red-500 font-medium">
          Log Out
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default ProfileScreen;
