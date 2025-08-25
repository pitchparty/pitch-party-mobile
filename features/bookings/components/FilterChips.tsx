// src/components/FilterChips.tsx
import React from "react";
import { TouchableOpacity, Text, View, ScrollView } from "react-native";

interface FilterChipProps {
  label: string;
  value: string;
  isSelected: boolean;
  onPress: () => void;
}

const FilterChip = ({ label, value, isSelected, onPress }: FilterChipProps) => (
  <TouchableOpacity
    onPress={onPress}
    className={`border border-gray-200 px-4 py-2 rounded-full mr-2 ${
      isSelected ? "bg-blue-500" : "bg-gray-50 dark:bg-gray-700"
    }`}
  >
    <Text
      className={
        isSelected ? "text-white font-medium" : "text-gray-700 dark:text-gray-400"
      }
    >
      {label}
    </Text>
  </TouchableOpacity>
);

interface FilterChipsProps {
  filters: { label: string; value: string }[];
  selectedFilter: string;
  onSelect: (value: string) => void;
}

export const FilterChips = ({ filters, selectedFilter, onSelect }: FilterChipsProps) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} className="flex-row space-x-2">
      {filters.map((filter) => (
        <FilterChip
          key={filter.value}
          label={filter.label}
          value={filter.value}
          isSelected={selectedFilter === filter.value}
          onPress={() => onSelect(filter.value)}
        />
      ))}
    </ScrollView>
  );
};