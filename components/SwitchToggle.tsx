import React from "react";
import { StyleSheet, Switch, Text, View } from "react-native";
import { Feather } from "@expo/vector-icons";

type SwitchToggleProps = {
  isEnabled: boolean;
  title: string;
  icon: string;
  setIsEnabled: (value: boolean) => void;
};

const SwitchToggle = ({
  isEnabled,
  setIsEnabled,
  title,
  icon,
}: SwitchToggleProps) => {
  return (
    <View
      className={`flex-row items-center justify-between p-4 border-b border-gray-100`}
    >
      <View className={`flex-row items-center`}>
        <View className={`w-10 items-center`}>
          <Feather
            name={icon as keyof typeof Feather.glyphMap}
            size={20}
            color="#4299E1"
          />
        </View>
        <Text className={`text-gray-700   font-semibold`}>{title}</Text>
      </View>
      <Switch
        value={isEnabled}
        onValueChange={setIsEnabled}
        trackColor={{ false: "#CBD5E0", true: "#90CDF4" }}
        thumbColor={isEnabled ? "#3182CE" : "#CBD5E0"}
      />
    </View>
  );
};

export default SwitchToggle;
