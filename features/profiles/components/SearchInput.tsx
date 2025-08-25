// features/profiles/components/SearchInput.tsx
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { View, TextInput, TouchableOpacity } from "react-native";

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
  onClear?: () => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder,
  onClear,
}) => {
  return (
    <View className="flex-row items-center bg-white dark:bg-gray-800 rounded-lg p-3 my-4 border border-gray-200 dark:border-gray-700">
      <Ionicons name="search-outline" size={20} color="#6B7280" className="mr-2" />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6B7280"
        className="flex-1 text-gray-900 dark:text-white"
        autoCapitalize="none"
      />
      {value.length > 0 && onClear && (
        <TouchableOpacity onPress={onClear} className="ml-2">
          <Ionicons name="close-circle" size={20} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchInput;