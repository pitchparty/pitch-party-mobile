import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface ErrorStateProps {
  message: string;
  onRetry: () => void;
}

const ErrorState: React.FC<ErrorStateProps> = ({ message, onRetry }) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const bgColor = isDarkMode ? "bg-red-900" : "bg-red-100";
  const iconColor = "#EF4444";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-700";
  const buttonBg = "#EF4444";
  const buttonTextColor = "text-white";
  const shadow = "shadow";

  return (
    <View className={`flex-1 justify-center items-center p-8 ${bgColor}`}>
      <Ionicons
        name="alert-circle-outline"
        size={64}
        color={iconColor}
        className="mb-4"
      />
      <Text className={`text-center text-lg font-semibold ${textColor} mb-6`}>
        {message}
      </Text>
      <TouchableOpacity
        className={`flex-row items-center ${buttonBg} py-3 px-6 rounded-md ${shadow}`}
        onPress={onRetry}
      >
        <Ionicons name="refresh-outline" size={20} color={"#fff"} className="mr-2" />
        <Text className={`text-lg font-semibold ${buttonTextColor}`}>
          Try Again
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default ErrorState;