import React from "react";
import {
  ActivityIndicator,
  TouchableOpacityProps,
  TouchableOpacity,
  Text
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

interface ThemedButtonProps extends TouchableOpacityProps {
  label: string;
  isLoading?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  state?: "default" | "success" | "error" | "warning" | "disabled";
}

// Utility to return colors based on the state
const getButtonStyles = (state: ThemedButtonProps["state"]) => {
  switch (state) {
    case "success":
      return {
        bg: "bg-green-600",
        text: "text-white",
        iconColor: "white"
      };
    case "error":
      return {
        bg: "bg-red-500",
        text: "text-white",
        iconColor: "white"
      };
    case "warning":
      return {
        bg: "bg-yellow-500",
        text: "text-black",
        iconColor: "black"
      };
    case "disabled":
      return {
        bg: "bg-gray-400",
        text: "text-gray-600",
        iconColor: "gray"
      };
    default:
      return {
        bg: "bg-blue-600",
        text: "text-white",
        iconColor: "white"
      };
  }
};

const ThemedButton = ({
  label,
  isLoading = false,
  iconName,
  state = "default",
  ...props
}: ThemedButtonProps) => {
  const styles = getButtonStyles(state);
  const isDisabled = state === "disabled" || isLoading;

  return (
    <TouchableOpacity
      className={`${styles.bg} w-full py-3 rounded-lg my-2 flex-row items-center justify-center`}
      activeOpacity={isDisabled ? 1 : 0.7}
      disabled={isDisabled}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={styles.text === "text-white" ? "white" : "black"} />
      ) : (
        <>
          {iconName && (
            <Ionicons
              name={iconName}
              size={18}
              color={styles.iconColor}
              className="mr-2"
            />
          )}
          <Text className={`${styles.text} text-center font-semibold`}>
            {label}
          </Text>
        </>
      )}
    </TouchableOpacity>
  );
};

export default ThemedButton;
