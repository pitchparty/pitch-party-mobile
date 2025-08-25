import React from "react";
import colors from "tailwindcss/colors";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";

interface AlertBannerProps {
  icon: string;
  message: string;
  actionLabel: string;
  onAction: () => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({
  icon,
  message,
  actionLabel,
  onAction,
}) => {
  const { colorScheme } = useColorScheme();
  const isDarkMode = colorScheme === "dark";

  const bgColor = isDarkMode ? colors.yellow[800] : colors.yellow[200];
  const buttonBg = "bg-white";
  const buttonTextColor = "text-blue-700";
  const shadow = "shadow";
  const buttonShadow = "shadow-sm";

  return (
    <View
      className={`p-6 mx-4 mt-4 rounded-xl flex-col items-center justify-between ${bgColor} ${shadow} dark:shadow-none`}
      style={{
        backgroundColor: bgColor,
      }}
    >
      <View className="flex-row items-center flex-1">
        <Ionicons
          name={icon as any}
          size={26}
          color={"blue"}
          className="mr-2"
        />
        <Text className={`flex-shrink text-black dark:text-white`}>
          {message}
        </Text>
      </View>
      {/* <TouchableOpacity
        className={`mt-4 ${buttonBg} px-3 py-1 rounded-md ${buttonShadow}`}
        onPress={onAction}
      >
        <Text className={`${buttonTextColor} font-semibold text-sm`}>
          {actionLabel}
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default AlertBanner;
