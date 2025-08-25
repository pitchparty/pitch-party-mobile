import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

interface ManagerProgressBarProps {
  progress: number; // 0-100
  color?: string;
  height?: number;
  className?: string;
}


const ManagerProgressBar: React.FC<ManagerProgressBarProps> = ({
  progress,
  color = '#2563EB', // Default blue color
  height = 6,
  className = '',
}) => {
  const progressWidth = useSharedValue(0);
  
  useEffect(() => {
    // Animate progress change
    progressWidth.value = withTiming(progress / 100, { duration: 800 });
  }, [progress]);
  
  const progressStyle = useAnimatedStyle(() => {
    return {
      width: `${progressWidth.value * 100}%`,
      backgroundColor: color,
      height,
    };
  });
  
  return (
    <View className={`w-full bg-gray-200 rounded-full overflow-hidden ${className}`}>
      <Animated.View style={progressStyle} className="rounded-full" />
    </View>
  );
};

export default ManagerProgressBar;