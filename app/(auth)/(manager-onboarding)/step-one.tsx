import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import {
  FormInput,
  PasswordInput,
  usePersonalSubmit,
} from "@/features/create-account";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";
import { useAddVenueForm } from "@/features/venues/hooks/useAddVenueForm";

export default function StepOneScreen() {
  const isKeyboardVisible = useKeyboardVisible();
  const { methods, onSubmit, isSubmitting } = usePersonalSubmit();
  const { venueData } = useAddVenueForm();

  console.log("Venue Data",venueData)
  
  const { control, formState, handleSubmit } = methods;
  const { errors, isValid } = formState;


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-blue-50 dark:bg-gray-900"
    >
      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row">
          <View className="flex-1 mr-4">
            <FormInput
              control={control}
              name="first_name"
              label="First Name"
              placeholder="Enter your first name"
              errorMessage={errors.first_name?.message}
            />
          </View>
          <View className="flex-1">
            <FormInput
              control={control}
              name="last_name"
              label="Last Name"
              placeholder="Enter your last name"
              errorMessage={errors.last_name?.message}
            />
          </View>
        </View>
        <FormInput
          control={control}
          name="email"
          label="Email"
          placeholder="Enter your email."
          keyboardType="email-address"
          autoCapitalize="none"
          errorMessage={errors.email?.message}
        />
        <PasswordInput control={control} errors={errors} />
        <FormInput
          control={control}
          name="username"
          label="Username"
          placeholder="Choose a username"
          autoCapitalize="none"
          errorMessage={errors.username?.message}
        />
        <FormInput
          control={control}
          name="phone_number"
          label="Phone Number"
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
          errorMessage={errors.phone_number?.message}
        />
      </ScrollView>

      {!isKeyboardVisible && (
        <>
          <TouchableOpacity
            className={`py-4 rounded-lg mb-4 mx-4 flex-row justify-center items-center ${
              isValid ? "bg-blue-500" : "bg-blue-300"
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text className="text-white text-center font-semibold text-lg">
                Next
              </Text>
            )}
          </TouchableOpacity>
          <Text className="text-gray-500 text-center text-sm mb-8 px-4">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </Text>
        </>
      )}
    </KeyboardAvoidingView>
  );
}
