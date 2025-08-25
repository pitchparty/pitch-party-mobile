import React from 'react';
import { View, Text, TextInput, TextInputProps } from 'react-native';
import { Control, Controller, FieldValues, Path } from 'react-hook-form';

interface FormInputProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  errorMessage?: string;
}

const FormInput = <T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  keyboardType,
  autoCapitalize,
  errorMessage,
  ...props
}: FormInputProps<T>) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            className={`border rounded-lg p-4 bg-gray-50 ${errorMessage ? 'border-red-500' : 'border-gray-300'}`}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            {...props}
          />
        )}
      />
      {errorMessage && (
        <Text className="text-red-500 mt-1 text-sm">{errorMessage}</Text>
      )}
    </View>
  );
};

export default FormInput;
