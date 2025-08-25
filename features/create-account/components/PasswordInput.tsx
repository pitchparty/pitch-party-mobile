import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import { Control, Controller, FieldErrors } from 'react-hook-form';

interface PasswordInputProps extends TextInputProps {
  control: Control<any>;
  errors: FieldErrors<any>;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ control, errors,  ...props }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">Password</Text>
      <View className={`flex-row items-center border rounded-lg bg-gray-50 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}>
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              className="flex-1 p-4"
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              {...props}
            />
          )}
        />
        <TouchableOpacity
          className="p-4"
          onPress={() => setShowPassword(!showPassword)}
        >
          <Text className="text-blue-600 font-medium">{showPassword ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>
      {errors.password && (
        // @ts-ignore
        <Text className="text-red-500 mt-1 text-sm">{errors?.password?.message}</Text>
      )}
      <Text className="text-gray-500 mt-1 text-xs">
        Password must be at least 8 characters and include uppercase, lowercase, and numbers
      </Text>
    </View>
  );
};

export default PasswordInput;