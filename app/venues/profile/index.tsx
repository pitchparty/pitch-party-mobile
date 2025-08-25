import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import React, { useLayoutEffect } from "react";
import AddressInput from "@/components/AddressInput";
import { MultiSelect } from "@/components/MultiSelect";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import RedeemableCheckbox from "@/features/authentication/components/RedeemableCheckbox";
import { DEFAULT_AMENITIES } from "@/features/venues/constants";
import { Controller, useForm } from "react-hook-form";
import { VenueFormData, venueSchema, initialVenueValues } from "@/features/venues/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import ThemedButton from "@/components/ui/ThemedButton";
import { useRegisterVenue } from "@/features/authentication/hooks";
import { toast } from "sonner-native";
import { useNavigation, useRouter } from "expo-router";
import { useAuthStore } from "@/features/authentication/store";
import { useVenueByManager } from "@/features/venues/hooks";

const VenueProfile = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);
  const userId = user?.id as string;

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Venue Profile",
    });
  }, [navigation]);

  console.log("userId", userId); // Add this line to check the user ID

  const {
    data: venues,
    isLoading: isVenuesLoading,
    isFetched: isVenuesFetched,
  } = useVenueByManager(userId);

  console.log("venues", venues); // Add this line to check the venues data

  const existingVenue = venues?.[0]; // Assuming only one venue per manager for now

  console.log("existingVenue", existingVenue); // Add this line to check the existing venue data

  const defaultValues = existingVenue
    ? {
        name: existingVenue.name,
        address: existingVenue.address,
        longitude: Number(existingVenue.longitude),
        latitude: Number(existingVenue.latitude),
        amenities: existingVenue.amenities,
        capacity: String(existingVenue.capacity),
        manager_id: userId,
        contact_phone: existingVenue.contact_phone,
        contact_email: existingVenue.contact_email,
        pricing: existingVenue.pricing,
        redemption_option: existingVenue.redemption_option,
      }
    : initialVenueValues;

    console.log( "defaultValues", defaultValues)

  const form = useForm<VenueFormData>({
    resolver: zodResolver(venueSchema),
    defaultValues: defaultValues,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const { mutate: registerVenue, isPending: isLoading } = useRegisterVenue();

  const onSubmit = async (data: VenueFormData) => {
    await registerVenue(
      { ...data, manager_id: userId },
      {
        onSuccess: () => {
          toast.success("Venue registered successfully");
          return router.back();
        },
        onError: (error) => {
          toast.error("Something went wrong, please try again later");
          console.error(error);
        },
      }
    );
  };

  if (!isVenuesFetched) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

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
      <ThemedButton
          label={isLoading ? "Registering..." : "Register Venue"}
          onPress={form.handleSubmit(onSubmit)}
          isLoading={isLoading}
        />
    </ScrollView>
  );
};

export default VenueProfile;

const styles = StyleSheet.create({});
