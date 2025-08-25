import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { View } from 'react-native';
import { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

interface ManagerButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  className?: string;
}



const ManagerButton: React.FC<ManagerButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  isLoading = false,
  disabled = false,
  fullWidth = false,
  icon,
  className = '',
}) => {
  // Animation values
  const scale = useSharedValue(1);
  
  // Define ManagerButton styles based on variant
  const getButtonStyle = () => {
    switch (variant) {
      case 'primary':
        return 'bg-blue-600 active:bg-blue-700';
      case 'secondary':
        return 'bg-purple-600 active:bg-purple-700';
      case 'outline':
        return 'bg-transparent border border-blue-600 active:bg-blue-50';
      default:
        return 'bg-blue-600 active:bg-blue-700';
    }
  };
  
  // Define text styles based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'outline':
        return 'text-blue-600';
      default:
        return 'text-white';
    }
  };
  
  // Handle press animation
  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 15, stiffness: 300 });
  };
  
  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 15, stiffness: 300 });
  };
  
  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
    };
  });
  
  return (
    <Animated.View 
      style={animatedStyle} 
      className={`overflow-hidden rounded-lg ${fullWidth ? 'w-full' : ''} ${className}`}
    >
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || isLoading}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        className={`py-3 px-5 flex-row items-center justify-center ${getButtonStyle()} ${disabled ? 'opacity-50' : 'opacity-100'}`}
      >
        {isLoading ? (
          <ActivityIndicator color={variant === 'outline' ? '#2563EB' : 'white'} size="small" />
        ) : (
          <>
            {icon && <View className="mr-2">{icon}</View>}
            <Text className={`font-semibold text-base ${getTextStyle()}`}>{title}</Text>
          </>
        )}
      </TouchableOpacity>
    </Animated.View>
  );
};

export default ManagerButton;