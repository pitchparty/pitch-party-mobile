import React from "react";
import { Text, Pressable, View } from "react-native";
import { Controller, Control } from "react-hook-form";
import DateTimePicker from "@react-native-community/datetimepicker";

interface DatePickerInputProps {
  label: string;
  name: string;
  control: Control<any>;
}

export const DatePickerInput = ({ label, name, control }: DatePickerInputProps) => {
  const [showDatePicker, setShowDatePicker] = React.useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="mb-4">
          <Text className="text-gray-700 dark:text-gray-300 font-medium mb-1">
            {label}
          </Text>
          <Pressable
            onPress={() => setShowDatePicker(true)}
            className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 p-3 rounded-lg"
          >
            <Text className="text-gray-900 dark:text-gray-300">
              {value ? value.toDateString() : "Select a date"}
            </Text>
          </Pressable>
          {showDatePicker && (
            <DateTimePicker
              value={value || new Date()}
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                setShowDatePicker(false);
                if (selectedDate) {
                  onChange(selectedDate);
                }
              }}
            />
          )}
          {error && (
            <Text className="text-red-500 text-xs mt-1">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
};