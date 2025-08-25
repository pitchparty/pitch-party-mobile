import React from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import colors from "tailwindcss/colors";

interface LoadingStateProps {
  icon?: string;
  message: string;
}

const LoadingState: React.FC<LoadingStateProps> = ({
  icon = "hourglass-outline",
  message,
}) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const bgColor = isDarkMode ? "bg-gray-900" : "bg-gray-100";
  const iconColor = "text-gray-400";
  const spinnerColor = isDarkMode ? "#D1D5DB" : "#4B5563";
  const textColor = isDarkMode ? "text-gray-400" : "text-gray-500";

  return (
    <View className={`flex-1 justify-center items-center p-8 ${bgColor}`}>
      <Ionicons
        name={icon as any}
        size={48}
        color={colors.gray[400]}
      />
      <Text className={`text-center text-lg ${textColor}`}>{message}</Text>
    </View>
  );
};

export default LoadingState;