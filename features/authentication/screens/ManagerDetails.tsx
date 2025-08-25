import React from "react";
import { View, ScrollView } from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";

import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { UserFormData } from "@/features/authentication/schema";

const ManagerDetails = ({ form }: { form: UseFormReturn<UserFormData> }) => {
  const {
    control,
    formState: { errors },
  } = form;

  return (
    <ScrollView
      className="flex-1 bg-blue-50 dark:bg-gray-900 p-6"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      <View className="flex flex-row justify-between mb-2">
        <Controller
          control={control}
          name="first_name"
          render={({ field: { onChange, value } }) => (
            <ThemedTextInput
              label="First Name"
              value={value}
              onChangeText={onChange}
              error={errors.first_name?.message}
              placeholder="John"
              className="mr-2 w-40"
            />
          )}
        />
        <Controller
          control={control}
          name="last_name"
          render={({ field: { onChange, value } }) => (
            <ThemedTextInput
              label="Last Name"
              value={value}
              onChangeText={onChange}
              error={errors.last_name?.message}
              placeholder="Doe"
              className="w-40"
            />
          )}
        />
      </View>

      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Username"
            value={value}
            onChangeText={onChange}
            error={errors.username?.message}
            placeholder="JohnDoe"
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Email"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
            placeholder="john@example.com"
            keyboardType="email-address"
          />
        )}
      />
      <Controller
        control={control}
        name="phone_number"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Phone Number"
            value={value}
            onChangeText={onChange}
            error={errors.phone_number?.message}
            placeholder="+254 7xx xxx xxxx"
            keyboardType="phone-pad"
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Password"
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
            placeholder="••••••••"
            isPassword
            autoCapitalize="none"
          />
        )}
      />
    </ScrollView>
  );
};

export default ManagerDetails;
