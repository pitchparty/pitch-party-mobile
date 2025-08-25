import React, {  useState } from "react";
import { View, Text, ScrollView } from "react-native";
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect'

import ToggleItem from "@/components/ToggleItem";
import { useNavigation } from "expo-router";

type Settings = {
  allowNotifications: boolean;
  pushNotifications: boolean;
  emailNotifications: boolean;
  directMessages: boolean;
  likes: boolean;
  mentions: boolean;
  soundEnabled: boolean;
  marketing: boolean;
};

const NotificationSettingsScreen = () => {
  const navigation = useNavigation();

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      title: "Notification Settings"
    });
  }, [navigation])

  const [settings, setSettings] = useState<Settings>({
    allowNotifications: true,
    pushNotifications: true,
    emailNotifications: false,
    directMessages: true,
    likes: true,
    mentions: true,
    soundEnabled: true,
    marketing: false,
  });

  const handleToggle = (key: keyof Settings) => {
    setSettings((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <ScrollView className="flex-1 bg-blue-100 dark:bg-gray-900">
      <View className="bg-gray-50 dark:bg-gray-800 px-4 py-2">
        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
          General
        </Text>
      </View>

      <ToggleItem
        icon={'notifications'}
        title="Allow Notifications"
        description="Enable or disable all notifications"
        value={settings.allowNotifications}
        onToggle={() => handleToggle("allowNotifications")}
      />

      <ToggleItem
        icon={'message'}
        title="Push Notifications"
        description="Receive push notifications on your device"
        value={settings.pushNotifications}
        onToggle={() => handleToggle("pushNotifications")}
      />

      <View className="bg-gray-50 dark:bg-gray-800 px-4 py-2">
        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
          Additional Settings
        </Text>
      </View>

      <ToggleItem
        icon={'volume-up'}
        title="Sound"
        description="Play sounds for notifications"
        value={settings.soundEnabled}
        onToggle={() => handleToggle("soundEnabled")}
      />

      <View className="h-8" />
    </ScrollView>
  );
};

export default NotificationSettingsScreen;

{
  /* <ToggleItem
        icon={Globe}
        title="Marketing"
        description="Receive marketing and promotional emails"
        value={settings.marketing}
        onToggle={() => handleToggle("marketing")}
      />

      <NavigationItem
        icon={Bell}
        title="Advanced Settings"
        onPress={() => {
          // Navigate to advanced settings
          console.log("Navigate to advanced settings");
        }}
      /> */
}

// const NavigationItem = ({ icon: Icon, title, onPress }: any) => (
//   <TouchableOpacity
//     className="flex-row items-center justify-between p-4 border-b border-gray-100"
//     onPress={onPress}
//   >
//     <View className="flex-row items-center">
//       <View className="w-8 h-8 rounded-full bg-blue-100 items-center justify-center mr-3">
//         <Icon size={18} color="#3b82f6" />
//       </View>
//       <Text className="text-base font-medium text-gray-900">{title}</Text>
//     </View>
//     <ChevronRight size={20} color="#9ca3af" />
//   </TouchableOpacity>
// );
