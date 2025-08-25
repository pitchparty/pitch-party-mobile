import { router } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';
import { Svg, Path, Circle, Rect } from 'react-native-svg';

const SportsForbiddenScreen = () => {
  return (
    <View className="flex-1 bg-gray-50 justify-center items-center px-4">
      {/* Custom SVG Illustration */}
      <Svg width="240" height="240" viewBox="0 0 240 240" fill="none">
        {/* Basketball Court Background */}
        <Rect x="20" y="40" width="200" height="160" fill="#FF6B6B" opacity={0.1} />
        <Path
          d="M20 120 L220 120"
          stroke="#FF6B6B"
          strokeWidth="2"
          strokeDasharray="4 4"
        />
        
        {/* Center Circle */}
        <Circle cx="120" cy="120" r="30" stroke="#FF6B6B" strokeWidth="2" fill="none" />
        
        {/* Whistle */}
        <Path
          d="M90 140 C90 140, 110 140, 130 140 C150 140, 150 160, 130 160 C110 160, 90 160, 90 160 Z"
          fill="#334155"
        />
        <Circle cx="95" cy="150" r="5" fill="#475569" />
        
        {/* Red Cross/Stop Symbol */}
        <Circle cx="120" cy="120" r="40" stroke="#EF4444" strokeWidth="8" />
        <Path
          d="M95 120 L145 120 M120 95 L120 145"
          stroke="#EF4444"
          strokeWidth="8"
          strokeLinecap="round"
        />
      </Svg>

      {/* Error Message */}
      <Text className="mt-8 text-3xl font-bold text-gray-900">
        403 - Out of Bounds!
      </Text>
      <Text className="mt-4 text-lg text-gray-600 text-center max-w-sm">
        Looks like you're trying to access a restricted area. You don't have permission to play here!
      </Text>

      {/* Action Button */}
      <TouchableOpacity 
        className="mt-8 bg-red-500 px-6 py-3 rounded-full active:bg-red-600"
        onPress={() => router.replace("/(auth)/onboarding")}
      >
        <Text className="text-white font-semibold text-lg">
          Back to Home Court
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SportsForbiddenScreen;