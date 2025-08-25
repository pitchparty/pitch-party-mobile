import React, { useRef } from "react";
import { View, Text, Pressable } from "react-native";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";

// Define the animations for different empty states
const animations = {
  bookings: require("../assets/animations/empty-bookings.json"),
  notifications: require("../assets/animations/empty-notifications.json"),
  venues: require("../assets/animations/empty-state.json"),
  default: require("../assets/animations/empty-state.json"),
};

// Define icons for different empty states (as a fallback)
const icons = {
  bookings: "calendar",
  notifications: "notifications",
  venues: "business",
  default: "alert-circle",
};

// Default messages for different empty states
const defaultMessages = {
  bookings: {
    title: "No Bookings Found",
    description:
      "You currently don't have any pending bookings. New bookings will appear here.",
  },
  notifications: {
    title: "No Notifications",
    description:
      "You don't have any notifications at the moment. Check back later.",
  },
  venues: {
    title: "No Venues Found",
    description:
      "You haven't added any venues yet. Add your first venue to get started.",
  },
  default: {
    title: "Nothing Found",
    description: "There are no items to display at the moment.",
  },
};

// Component props
interface EmptyStateProps {
  type?: "bookings" | "notifications" | "venues" | "default";
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  animationSource?: any;
  animationSize?: number;
  className?: string;
  showAnimation?: boolean;
  iconSize?: number;
  iconColor?: string;
  testID?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  type = "default",
  title,
  description,
  actionLabel,
  onAction,
  animationSource,
  animationSize = 200,
  className = "",
  showAnimation = true,
  iconSize = 60,
  iconColor = "#9CA3AF",
  testID,
}) => {
  const animation = useRef<LottieView>(null);

  // Get the appropriate animation source
  const source = animationSource || animations[type] || animations.default;

  // Get default messages for the specified type
  const defaultMessage = defaultMessages[type] || defaultMessages.default;

  // Use provided title/description or fall back to defaults
  const displayTitle = title || defaultMessage.title;
  const displayDescription = description || defaultMessage.description;

  return (
    <View
      className={`items-center justify-center p-5 flex-1 ${className}`}
      testID={testID}
    >
        
      {/* {showAnimation ? (
        <LottieView
        autoPlay
        ref={animation}
          source={source}
          style={{ width: animationSize, height: animationSize }}
          resizeMode="contain"
        />
      ) : (
        <Ionicons
          name={icons[type] as keyof typeof Ionicons.glyphMap}
          size={iconSize}
          color={iconColor}
        />
      )} */}

      <Text className="text-lg font-semibold text-gray-700 mt-4 text-center">
        {displayTitle}
      </Text>

      <Text className="text-sm text-gray-500 text-center mt-2 mx-5 leading-5">
        {displayDescription}
      </Text>

      {actionLabel && onAction && (
        <Pressable className="mt-5" onPress={onAction}>
          <Text className="text-blue-500 font-medium text-base">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
};

export default EmptyState;
