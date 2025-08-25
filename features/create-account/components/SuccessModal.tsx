import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Modal from 'react-native-modal';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';

interface SuccessModalProps {
  isVisible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmButtonText?: string;
}


const SuccessModal: React.FC<SuccessModalProps> = ({
  isVisible,
  onClose,
  onConfirm,
  title = 'Success!',
  message = 'Your submission was successful.',
  confirmButtonText = 'Continue',
}) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.ease) });
      scale.value = withSpring(1, { damping: 10, stiffness: 100 });
    } else {
      opacity.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) });
      scale.value = withTiming(0, { duration: 200, easing: Easing.in(Easing.ease) });
    }
  }, [isVisible]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Modal isVisible={isVisible} onBackdropPress={onClose} animationIn="fadeIn" animationOut="fadeOut" backdropOpacity={0.5}>
      <Animated.View style={[animatedStyle, { backgroundColor: 'white', borderRadius: 10, padding: 24, alignItems: 'center' }]}>
        <View className="bg-green-100 rounded-full p-4 mb-4">
          <Ionicons name="checkmark-circle" size={64} color="green" />
        </View>
        <Text className="text-xl font-bold text-gray-800 mb-2 text-center">{title}</Text>
        <Text className="text-gray-600 text-center mb-4">{message}</Text>
        <View className="flex-row justify-center w-full">
          <TouchableOpacity className="bg-blue-500 rounded-md py-4 px-4 items-center" onPress={onConfirm}>
            <Text className="text-white font-semibold text-lg">{confirmButtonText}</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </Modal>
  );
};

export default SuccessModal;