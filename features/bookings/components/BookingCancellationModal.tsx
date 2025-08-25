import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { parse, formatISO, differenceInHours } from "date-fns";
import ThemedButton from "@/components/ui/ThemedButton";
import { UserRole } from "@/features/authentication/types";

// Props now use separate date and time
type BookingCancellationModalProps = {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  eventDate: string; // e.g., '2025-03-08'
  eventTime: string; // e.g., '15:00:00'
  userRole: UserRole
};

// Helper to merge date + time into full Date object
const combineDateAndTime = (date: string, time: string): Date => {
  const dateTimeString = `${date}T${time}`;
  return parse(dateTimeString, "yyyy-MM-dd'T'HH:mm:ss", new Date());
};

// Refund message logic
const getRefundMessage = (eventDateTime: Date) => {
  const hoursToEvent = differenceInHours(eventDateTime, new Date());

  if (hoursToEvent >= 48) {
    return "You are eligible for a 100% refund.";
  } else if (hoursToEvent >= 24) {
    return "You are eligible for a 50% refund.";
  } else {
    return "No refund is available for this cancellation.";
  }
};

const BookingCancellationModal = ({
  visible,
  onClose,
  onConfirm,
  eventDate,
  eventTime,
  userRole,
}: BookingCancellationModalProps) => {
  const eventDateTime = combineDateAndTime(eventDate, eventTime);
  const refundMessage = getRefundMessage(eventDateTime);

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-4/5 bg-white dark:bg-gray-800 rounded-lg p-4">
          <Text className="text-lg font-semibold mb-2 dark:text-white">
            Refund Eligibility
          </Text>


          {userRole === 'user' ? <Text className="dark:text-gray-300 mb-4">{refundMessage}</Text> : <Text className="dark:text-gray-300 mb-4" >100% Refund will be returned.</Text>}

          <View className=" justify-end ">
            <ThemedButton label="Confirm Cancellation" onPress={onConfirm} state="error" />
            <ThemedButton label="Close" onPress={onClose} state="default" />
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default BookingCancellationModal;
