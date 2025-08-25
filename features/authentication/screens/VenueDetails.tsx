import React from "react";
import { ScrollView, View } from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";

import AddressInput from "@/components/AddressInput";
import { MultiSelect } from "@/components/MultiSelect";
import { VenueFormData } from "@/features/venues/schema";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { DEFAULT_AMENITIES } from "@/features/venues/constants";
import RedeemableCheckbox from "@/features/authentication/components/RedeemableCheckbox";

const VenueRegistration = ({
  form,
}: {
  form: UseFormReturn<VenueFormData>;
}) => {
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
      <AddressInput form={form} label="Venue Name" error={errors.address?.message} />
      <View className="mb-2">
        <Controller
          control={control}
          name="capacity"
          render={({ field: { onChange, value } }) => (
            <ThemedTextInput
              label="Capacity"
              value={value}
              onChangeText={onChange}
              error={errors.capacity?.message}
              placeholder="10"
              keyboardType="number-pad"
            />
          )}
        />
      </View>
      <View className="mb-2">
        <Controller
          control={control}
          name="amenities"
          render={({ field: { onChange, value } }) => (
            <MultiSelect
              label="Amenities"
              options={DEFAULT_AMENITIES}
              value={value || []}
              onChange={onChange}
              canAddNew
              error={errors.amenities?.message}
            />
          )}
        />
      </View>
      <View className="mb-2">
        <Controller
          control={control}
          name="contact_phone"
          render={({ field: { onChange, value } }) => (
            <ThemedTextInput
              label="Venue Contact Phone"
              value={value}
              onChangeText={onChange}
              error={errors.contact_phone?.message}
              placeholder="123-456-7890"
              keyboardType="phone-pad"
            />
          )}
        />
      </View>
      <View className="mb-2">
        <Controller
          control={control}
          name="contact_email"
          render={({ field: { onChange, value } }) => (
            <ThemedTextInput
              label="Venue Contact Email"
              value={value}
              onChangeText={onChange}
              error={errors.contact_email?.message}
              placeholder="example@example.com"
              keyboardType="email-address"
            />
          )}
        />
      </View>
      <View className="mb-2">
        <Controller
          control={control}
          name="pricing"
          render={({ field: { onChange, value } }) => (
            <ThemedTextInput
              label="Venue Pricing"
              value={value}
              onChangeText={onChange}
              error={errors.pricing?.message}
              placeholder="100"
              keyboardType="number-pad"
            />
          )}
        />
      </View>
      <RedeemableCheckbox form={form} />
    </ScrollView>
  );
};

export default VenueRegistration;
