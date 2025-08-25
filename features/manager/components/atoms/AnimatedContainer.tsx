import React, { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  withDelay,
  Easing,
} from 'react-native-reanimated';

interface AnimatedContainerProps {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}


const AnimatedContainer: React.FC<AnimatedContainerProps> = ({
  children,
  delay = 0,
  className = '',
}) => {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);
  
  useEffect(() => {
    opacity.value = withDelay(
      delay,
      withTiming(1, { duration: 500, easing: Easing.out(Easing.ease) })
    );
    
    translateY.value = withDelay(
      delay,
      withTiming(0, { duration: 500, easing: Easing.out(Easing.ease) })
    );
  }, []);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });
  
  return (
    <Animated.View style={animatedStyle} className={className}>
      {children}
    </Animated.View>
  );
};

export default AnimatedContainer;