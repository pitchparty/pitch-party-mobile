import React, { useRef } from "react";
import { View, Text } from "react-native";
import LottieView from "lottie-react-native";
import { useFocusEffect } from "@react-navigation/native";

const animations = {
  pending: require("../../assets/animations/searching.json"),
  error: require("../../assets/animations/error-state.json"),
  empty: require("../../assets/animations/empty-state.json"),
};

type StatusType = "pending" | "error" | "empty";

const StatusStateView = ({
  status = "empty",
  message,
  description,
  error,
}: {
  status: StatusType;
  message: string;
  description?: string;
  error?: Error;
}) => {
  const animationRef = useRef<LottieView | null>(null);

  useFocusEffect(() => {
    if (animationRef.current) {
      animationRef?.current?.play();
    }
  });

  const isPending = status === "pending";
  const isError = status === "error";

  return (
    <View className="flex-1 bg-blue-50 dark:bg-gray-900 items-center justify-center">
      <LottieView
        ref={animationRef}
        source={animations[status]}
        autoPlay={false}
        loop={isPending}
        style={{ width: isPending ? 500 : 300, height: 100 }}
      />
      <Text className="text-center font-medium text-gray-700 dark:text-gray-200">
        {isError ? error?.message || message : message}
      </Text>
      <Text className="text-gray-400 dark:text-gray-400 text-center mt-2 px-12">
        {description}
      </Text>
    </View>
  );
};

export default StatusStateView;

// const MyScreen = () => {
//     if (isPending) {
//       return <StatusStateView status="pending" message="Searching for bookings..." />;
//     }

//     if (isError) {
//       return <StatusStateView status="error" message="Failed to load bookings." error={error} />;
//     }

//     if (data.length === 0) {
//       return <StatusStateView status="empty" message="No bookings found." />;
//     }

//     return <FlatList data={data} ... />;
//   };
