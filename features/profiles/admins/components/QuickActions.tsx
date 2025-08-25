import React from "react";
import { Ionicons } from "@expo/vector-icons";
import {
  Text,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";

interface QuickActionProps extends TouchableOpacityProps {
  title: string;
  icon: string;
  color: string;
}

const QuickActionButton: React.FC<QuickActionProps> = ({
  title,
  icon,
  color,
  ...props
}) => {
  return (
    <TouchableOpacity
      style={{ width: "48%" }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-4 mb-4 flex-row items-center"
      {...props}
    >
      <View
        className={`h-10 w-10 rounded-full ${color} items-center justify-center mr-3`}
      >
        <Ionicons
          name={icon as keyof typeof Ionicons.glyphMap}
          size={20}
          color="white"
        />
      </View>
      <Text className="font-medium text-gray-800 dark:text-gray-200">
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default QuickActionButton;
