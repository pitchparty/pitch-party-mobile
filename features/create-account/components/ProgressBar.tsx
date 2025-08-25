// ProgressBar.tsx
import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  label?: string;
  visible: boolean;
}

const ProgressBar: React.FC<Props> = ({ visible, label }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      progress.value = 0;
      progress.value = withTiming(1, { duration: 6000 }); 
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  if (!visible) return null;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.bar, animatedStyle]} />
      {label && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 6,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    overflow: 'hidden',
    marginTop: 12,
  },
  bar: {
    height: 6,
    backgroundColor: '#3B82F6',
  },
  label: {
    marginTop: 6,
    fontSize: 12,
    color: '#6B7280',
  },
});

export default ProgressBar;
