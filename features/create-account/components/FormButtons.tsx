// components/FormButtons.tsx
import React from "react";
import { View, TouchableOpacity, Text, ActivityIndicator } from "react-native";

type Props = {
  previousText?: string;
  onPrevious: () => void;
  onNext: () => void;
  isValid: boolean;
  isSubmitting: boolean;
};

export default function FormButtons({
  previousText = 'Previous',
  onPrevious,
  onNext,
  isValid,
  isSubmitting,
}: Props) {
  return (
    <View className="flex-row justify-between mb-8 mt-6">
      <TouchableOpacity
        className="py-4 rounded-lg flex-1 mr-2 bg-gray-100"
        onPress={onPrevious}
      >
        <Text className="text-gray-700 text-center font-semibold text-lg">
          {previousText}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        className={`py-4 rounded-lg flex-1 ml-2 ${
          isValid ? "bg-blue-500" : "bg-blue-300"
        }`}
        onPress={onNext}
      >
        {isSubmitting ? (
          <ActivityIndicator color="white" size="small" />
        ) : (
          <Text className="text-white text-center font-semibold text-lg">
            Next
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
