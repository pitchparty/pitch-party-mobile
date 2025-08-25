import React, { useCallback, useMemo, useRef, useLayoutEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, useNavigation } from "expo-router";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";


import { FormInput } from "@/features/create-account";
import AddressInput from "@/features/create-account/components/AddressInput";
import AmenitiesBottomSheet from "@/features/create-account/components/AmenitiesBottomSheet";
import FormButtons from "@/features/create-account/components/FormButtons";
import RedemptionOption from "@/features/create-account/components/RedemptionOption";
import { useAddVenueForm } from "@/features/venues/hooks/useAddVenueForm";
import { useKeyboardVisible } from "@/hooks/useKeyboardVisible";

export default function AddVenue() {
  const isKeyboardVisible = useKeyboardVisible();

  const bottomSheetRef = useRef<BottomSheet>(null);

  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
    })
  })

  const { methods, venueData, onSubmit } = useAddVenueForm()

  const {
    control,
    formState: { errors, isValid },
    setValue,
    watch,
  } = methods;

  const watchedAmenities = watch("amenities", venueData?.amenities || []);

  const snapPoints = useMemo(() => ["25%", "50%", "75%"], []);

  const handlePresentBottomSheet = useCallback(() => {
    bottomSheetRef.current?.expand();
  }, []);

  const handleAmenitiesChange = useCallback(
    (selectedAmenities: string[]) => {
      setValue("amenities", selectedAmenities, {
        shouldValidate: true,
        shouldDirty: true,
      });
    },
    [setValue]
  );

  const handleDismissBottomSheet = useCallback(() => {
    bottomSheetRef.current?.close();
  }, []);

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1 px-4 pt-6"
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <AddressInput
          control={control}
          name="name"
          setValue={setValue}
          errors={errors}
        />

        <View className="mb-4">
          <Text className="text-gray-700 font-medium mb-2">Amenities</Text>
          <TouchableOpacity onPress={handlePresentBottomSheet}>
            <View
              className={`border rounded-lg p-4 bg-gray-50 ${
                errors.amenities ? "border-red-500" : "border-gray-300"
              }`}
            >
              <Text className="text-gray-500">
                {watchedAmenities && watchedAmenities.length > 0
                  ? watchedAmenities.join(", ")
                  : "Select amenities"}
              </Text>
            </View>
          </TouchableOpacity>
          {errors.amenities && (
            <Text className="text-red-500 mt-1 text-sm">
              {errors.amenities.message}
            </Text>
          )}
        </View>

        <View className="flex-row">
          <View className="flex-1 mr-4">
            <FormInput
              control={control}
              name="capacity"
              label="Capacity"
              placeholder="Enter the capacity"
              keyboardType="numeric"
              errorMessage={errors.capacity?.message}
            />
          </View>
          <View className="flex-1">
            <FormInput
              control={control}
              name="pricing"
              label="Pricing"
              keyboardType="numeric"
              placeholder="Enter the pricing"
              errorMessage={errors.pricing?.message}
            />
          </View>
        </View>

        <FormInput
          control={control}
          name="contact_phone"
          label="Contact Phone"
          keyboardType="numeric"
          placeholder="Enter the contact phone"
          errorMessage={errors.contact_phone?.message}
        />
        <FormInput
          control={control}
          name="contact_email"
          label="Contact Email"
          keyboardType="email-address"
          placeholder="Enter the contact email"
          errorMessage={errors.contact_email?.message}
        />

        <RedemptionOption control={control} />
      </ScrollView>

      {!isKeyboardVisible && (
        <FormButtons
          previousText="Go Back"
          onPrevious={() => router.back()}
          onNext={onSubmit}
          isValid={isValid}
          isSubmitting={false}
        />
      )}

      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        onClose={handleDismissBottomSheet}
      >
        <BottomSheetScrollView contentContainerStyle={{ padding: 16 }}>
          <AmenitiesBottomSheet
            onAmenitiesChange={handleAmenitiesChange}
            selectedAmenities={watchedAmenities || []}
          />
        </BottomSheetScrollView>
      </BottomSheet>
    </KeyboardAvoidingView>
  );
}
