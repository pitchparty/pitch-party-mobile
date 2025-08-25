import React from 'react';
import { Modal, View, Text, TouchableOpacity } from 'react-native';

type ReusableModalProps = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
};

const ReusableModal = ({ visible, onClose, title, children }: ReusableModalProps) => {
  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-4/5 bg-white dark:bg-gray-800 rounded-lg p-4">
          {title && (
            <Text className="text-lg font-semibold mb-2 dark:text-white">{title}</Text>
          )}
          <View className="mb-4">
            {children}
          </View>
          <TouchableOpacity
            onPress={onClose}
            className="self-end bg-blue-600 px-4 py-2 rounded"
          >
            <Text className="text-white">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default ReusableModal;
