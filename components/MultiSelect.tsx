import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import ThemedTextInput from "./ui/ThemedTextInput";
import { getInputBorderColor, INPUT_STYLE } from "@/constants/constants";

interface MultiSelectProps {
  label: string;
  options: string[];
  value: string[];
  onChange: (selected: string[]) => void;
  canAddNew?: boolean;
  error?: string;
}

export const MultiSelect: React.FC<MultiSelectProps> = ({
  label,
  options,
  value,
  onChange,
  canAddNew = false,
  error,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [newOption, setNewOption] = useState("");
  const [availableOptions, setAvailableOptions] = useState(options);

  const handleToggleOption = (option: string) => {
    const newSelection = value.includes(option)
      ? value.filter((item) => item !== option)
      : [...value, option];
    onChange(newSelection);
  };

  const handleAddNewOption = () => {
    if (newOption.trim() && !availableOptions.includes(newOption)) {
      setAvailableOptions([...availableOptions, newOption]);
      onChange([...value, newOption]);
      setNewOption("");
    }
  };

  return (
    <View className="mb-2">
      <Text className="text-sm font-medium mb-2">{label}</Text>

      <TouchableOpacity
        className={`${INPUT_STYLE} ${getInputBorderColor(
          Boolean(error),
          false
        )}`}
        onPress={() => setIsVisible(true)}
      >
        {value.length > 0 ? (
          <View className="flex-row flex-wrap gap-2">
            {value.map((item) => (
              <View
                key={item}
                className="bg-blue-100 px-3 py-1 rounded-full flex-row items-center"
              >
                <Text className="text-blue-800 text-sm">{item}</Text>
                <TouchableOpacity
                  onPress={() => handleToggleOption(item)}
                  className="ml-2"
                >
                  <Ionicons name="close" size={16} color="#1e40af" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        ) : (
          <Text className="text-gray-500">Select options</Text>
        )}
      </TouchableOpacity>
      {error && <Text className="text-red-500 mt-1 text-sm">{error}</Text>}
      <Modal
        transparent
        animationType="slide"
        visible={isVisible}
        onRequestClose={() => setIsVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="bg-white rounded-t-xl max-h-[80%]">
            <View className="p-4 border-b border-gray-200">
              <Text className="text-xl font-semibold mb-2">{label}</Text>

              {canAddNew && (
                <View className="flex-row justify-center">
                  <ThemedTextInput
                    value={newOption}
                    onChangeText={setNewOption}
                    placeholder="Add new option"
                    className="flex-1 max-w-[80%] mr-10"
                  />
                  <TouchableOpacity
                    onPress={handleAddNewOption}
                    className="bg-blue-500 h-12 w-10 rounded-lg items-center justify-center"
                  >
                    <Ionicons name="add" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            <ScrollView className="p-4">
              {availableOptions.map((option) => (
                <TouchableOpacity
                  key={option}
                  onPress={() => handleToggleOption(option)}
                  className="flex-row items-center justify-between py-3 px-4 border-b border-gray-100"
                >
                  <Text className="text-base">{option}</Text>
                  {value.includes(option) && (
                    <Ionicons name="checkmark" size={20} color="#2563eb" />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              onPress={() => setIsVisible(false)}
              className="p-4 bg-blue-500 m-4 rounded-lg"
            >
              <Text className="text-white text-center font-semibold">Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};
