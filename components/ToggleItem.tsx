import { StyleSheet, Switch, Text, View } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";

const ToggleItem = ({
  icon,
  title,
  description,
  value,
  onToggle,
}: any) => (
  <View className="flex-row items-center justify-between p-6 border-b border-gray-100">
    <View className="flex-row items-center flex-1">
      <View className="w-10 h-10 rounded-full bg-primary-100 items-center justify-center mr-3">
        <MaterialIcons name={icon} size={18} color="#6c9949" />
      </View>
      <View className="flex-1 mr-4">
        <Text className="text-base font-medium text-gray-900 dark:text-gray-300">{title}</Text>
        {description && (
          <Text className="text-sm text-gray-500 mt-0.5">{description}</Text>
        )}
      </View>
    </View>
    <Switch
      value={value}
      onValueChange={onToggle}
      trackColor={{ false: "#d1d5db", true: "#cbdfb7" }}
      thumbColor={value ? "#6c9949" : "#f3f4f6"}
      ios_backgroundColor="#d1d5db"
    />
  </View>
);

export default ToggleItem;

const styles = StyleSheet.create({});
