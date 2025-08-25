import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";

interface NavigationButtonsProps {
  currentPage: number;
  totalPages: number;
  onPrevious: () => void;
  onNext: () => void;
  isPending: boolean;
}

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
  isPending,
}) => {
  const buttonText = () => {
    if (currentPage === totalPages - 1) return "Submit";
    return "Next";
  };
  return (
    <View
      className={`flex-row ${
        currentPage === 0 ? "justify-end" : "justify-between"
      } p-2 bg-blue-50 border-t border-gray-200 bg-blue-50 dark:bg-gray-900`}
    >
      {currentPage > 0 && (
        <TouchableOpacity
          className="flex-row items-center bg-gray-200 px-4 py-3 rounded-full"
          onPress={onPrevious}
          disabled={isPending}
        >
          <Ionicons name="arrow-back" size={18} color="#4b5563" />
          <Text className="text-gray-700 font-medium ml-2">Previous</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        className={`flex-row items-center px-4 py-3 rounded-full ${
          isPending ? "bg-blue-400" : "bg-blue-600"
        }`}
        onPress={onNext}
        disabled={isPending}
      >
        <Text className="text-white font-medium mr-2">{buttonText()}</Text>
        {currentPage === totalPages - 1 ? (
          <Ionicons name="checkmark-circle" size={18} color="white" />
        ) : (
          <Ionicons name="arrow-forward" size={18} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
};

export default NavigationButtons;
