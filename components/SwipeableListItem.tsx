import React, { useCallback } from "react";
import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity, View } from "react-native";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";

interface ListItemProps {
  children: React.ReactNode;
  onApprove: () => void;
  onDismiss: () => void;
}

const SwipeableListItem: React.FC<ListItemProps> = ({
  children,
  onApprove,
  onDismiss,
}) => {
  const renderRightActions = useCallback(
    () => (
      <View className="flex-row items-center">
        <TouchableOpacity
          className="bg-green-500 justify-center items-center mx-2 rounded-md"
          style={{ width: 50, height: "60%" }}
          onPress={onApprove}
        >
          <Ionicons name="checkmark" size={28} color="white" />
        </TouchableOpacity>
        <TouchableOpacity
          className="bg-red-500 justify-center items-center rounded-md"
          style={{ width: 50, height: "60%" }}
          onPress={onDismiss}
        >
          <Ionicons name="close" size={28} color="white" />
        </TouchableOpacity>
      </View>
    ),
    [onApprove, onDismiss]
  );

  return (
    <ReanimatedSwipeable renderRightActions={renderRightActions}>
      {children}
    </ReanimatedSwipeable>
  );
};

export default SwipeableListItem;
