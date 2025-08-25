import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";

interface EmptyStateCardProps {
  icon: string;
  title: string;
  description?: string;
  actionLabel: string;
  onAction: () => void;
}

const EmptyStateCard: React.FC<EmptyStateCardProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
}) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const bgColor = isDarkMode ? "bg-gray-800" : "bg-white";
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-800";
  const descriptionColor = isDarkMode ? "text-gray-500" : "text-gray-500";
  const iconColor = isDarkMode ? "text-gray-400" : "text-gray-600";
  const buttonBg = "bg-blue-600";
  const buttonTextColor = "text-white";
  const shadow = "shadow-md";

  return (
    <View
      className={`m-4 p-6 rounded-xl items-center justify-center ${bgColor} ${shadow}`}
    >
      <Ionicons name={icon as any} size={48} className={`${iconColor} mb-4`} />
      <Text className={`text-lg font-semibold text-center ${textColor} mb-2`}>
        {title}
      </Text>
      {description && (
        <Text className={`text-center text-sm ${descriptionColor} mb-4`}>
          {description}
        </Text>
      )}
      <TouchableOpacity
        className={`flex-row items-center ${buttonBg} p-4 px-5 rounded-md mt-2 ${shadow}`}
        onPress={onAction}
      >
        <Ionicons
          name={
            actionLabel.includes("Create")
              ? "create-outline"
              : "add-circle-outline"
          }
          size={20}
          color={"#fff"}
          className="mr-2"
        />
        <Text className={`text-sm font-semibold ${buttonTextColor}`}>
          {actionLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyStateCard;
