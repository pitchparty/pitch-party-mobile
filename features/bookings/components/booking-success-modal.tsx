import { router } from 'expo-router';
import React, { useEffect } from 'react';
import { View, Text, Modal, Pressable } from 'react-native';

type BookingSuccessModalProps = {
  visible: boolean;
  onClose: () => void;
  data: {
    name: string;
    amount: number;
    booking_code: string;
    date?: string; // Optional extra data you might want to show
  };
};

const BookingSuccessModal: React.FC<BookingSuccessModalProps> = ({ visible, onClose, data }) => {
  
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose(); // Close the modal
        router.navigate("/(user)/user-bookings"); // Navigate to Bookings screen
      }, 6000); // 3 seconds

      return () => clearTimeout(timer); // Cleanup in case modal closes early
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white w-11/12 p-6 rounded-lg shadow-lg">
          <Text className="text-xl font-bold text-center mb-4">Booking Confirmed 🎉</Text>

          <View className="space-y-2">
            <Text className="text-gray-700">
              <Text className="font-semibold">Name:</Text> {data.name}
            </Text>
            <Text className="text-gray-700">
              <Text className="font-semibold">Amount:</Text> KES{data.amount.toFixed(2)}
            </Text>
            <Text className="text-gray-700">
              <Text className="font-semibold">Booking Code:</Text> {data.booking_code}
            </Text>
            {data.date && (
              <Text className="text-gray-700">
                <Text className="font-semibold">Date:</Text> {data.date}
              </Text>
            )}
          </View>

          <Pressable
            onPress={() => {
              onClose();
              router.navigate("/(user)/user-bookings");
            }}
            className="mt-6 bg-blue-600 py-3 rounded-lg"
          >
            <Text className="text-center text-white font-medium">Okay, Got it!</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default BookingSuccessModal;
