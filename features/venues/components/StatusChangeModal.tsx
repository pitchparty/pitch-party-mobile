import React from 'react';
import { Modal, View, Text, TouchableOpacity, TouchableWithoutFeedback, ActivityIndicator } from 'react-native';
import { Venue } from '../types'; // Import Venue type
import colors from 'tailwindcss/colors'; // Use Tailwind colors

interface StatusChangeModalProps {
  visible: boolean;
  currentStatus: Venue['status'] | undefined;
  onClose: () => void;
  onStatusSelect: (newStatus: Venue['status']) => void;
  isUpdating: boolean;
}

const StatusChangeModal: React.FC<StatusChangeModalProps> = ({
  visible,
  currentStatus,
  onClose,
  onStatusSelect,
  isUpdating,
}) => {
  const availableStatuses: Venue['status'][] = ['draft', 'published', 'archived'];

  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View className="flex-1 justify-end bg-black/60">
          {/* Wrap content in a safe inner view to prevent dismissal when tapping content */}
          <TouchableWithoutFeedback>
             <View className="bg-white dark:bg-gray-800 rounded-t-3xl p-6 shadow-lg">
              <Text className="text-xl font-bold mb-5 text-gray-800 dark:text-gray-100 text-center">
                Change Venue Status
              </Text>
              {isUpdating ? (
                <ActivityIndicator size="large" color={colors.blue[500]} className="my-4" />
              ) : (
                <>
                  {availableStatuses
                    .filter((status) => status !== currentStatus)
                    .map((status) => (
                      <TouchableOpacity
                        key={status}
                        className="py-4 border-b border-gray-200 dark:border-gray-700"
                        onPress={() => onStatusSelect(status)}
                      >
                        <Text className="text-lg text-gray-700 dark:text-gray-300 capitalize text-center">
                          Mark as {status}
                        </Text>
                      </TouchableOpacity>
                    ))}
                </>
              )}
              <TouchableOpacity
                className="py-4 mt-4"
                onPress={onClose}
                disabled={isUpdating} // Disable cancel while updating
              >
                <Text className="text-center text-red-500 text-lg font-medium">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default StatusChangeModal;