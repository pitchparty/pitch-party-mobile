import { Ionicons } from "@expo/vector-icons";
import React, { forwardRef } from "react";
import { TextInput as RNTextInput, View, Text, Pressable } from "react-native";

type TextInputProps = {
  label?: string;
  error?: string;
  helper?: string;
  isPassword?: boolean;
  disabled?: boolean;
  className?: string;
} & React.ComponentProps<typeof RNTextInput>;

const ThemedTextInput = forwardRef<RNTextInput, TextInputProps>(
  ({ label, error, helper, isPassword, disabled, className="w-full", ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);

    const getBorderColor = () => {
      if (error) return "border-red-500";
      if (isFocused) return "border-blue-500";
      return "border-gray-300";
    };

    const rightIconSize = isPassword && error ? 35 : 10;
    return (
      <View className={`${isPassword ? "mb-2" : "mb-4"}  ${className}`}>
        {/* Label */}
        {label && (
          <Text className={`mb-1 text-sm font-medium ${disabled ? "text-gray-400 dark:text-gray-300" : "text-gray-700 dark:text-gray-300"}`}>
            {label}
          </Text>
        )}

        {/* Input Container */}
        <View className="relative">
          <RNTextInput
            ref={ref}
            className={` 
               px-4 py-2 
              bg-white dark:bg-gray-700 rounded-lg border-2
              ${getBorderColor()}
              ${disabled ? "bg-gray-100 dark:bg-gray-700 text-gray-400" : "text-gray-900 dark:text-gray-400"}
              ${isPassword ? "pr-12" : ""}
            `}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            secureTextEntry={isPassword && !showPassword}
            editable={!disabled}
            placeholderTextColor="#9CA3AF"
            clearButtonMode="while-editing"
            allowFontScaling={false}
            {...props}
          />

          {/* Password Toggle Button */}
          {isPassword && (
            <Pressable
            style={{
              position: "absolute",
              right: rightIconSize,
              top: 2,
              padding: 8,
            }}
              onPress={() => setShowPassword(!showPassword)}
            >
              <Ionicons name={showPassword ? "eye-off" : "eye"} size={23} color="#6B7280" />
            </Pressable>
          )}

          {/* Error Icon */}
          {error && (
            <View style={{
              position: "absolute",
              right: 10,
              top: 2,
              padding: 8,
            }}>
              <Ionicons name="alert-circle" size={20} color="#EF4444" />
            </View>
          )}
        </View>

        {/* Helper Text / Error Message */}
        {(error || helper) && (
          <Text className={`mt-1 text-sm ${error ? "text-red-500" : "text-gray-500"}`}>
            {error || helper}
          </Text>
        )}
      </View>
    );
  }
);

export default ThemedTextInput;
