import React from "react";
import { View, Text } from "react-native";
import {
  Path,
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormSetValue,
} from "react-hook-form";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

interface AddressInputProps<T extends FieldValues> {
  name: Path<T>;
  control: Control<T>;
  setValue: UseFormSetValue<T>;
  errors: FieldErrors<T> | any;
}

const query = {
  language: "en",
  components: "country:KE",
  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
};

const AddressInput = <T extends FieldValues>({
  control,
  name,
  setValue,
  errors,
}: AddressInputProps<T>) => {
  return (
    <View className="mb-4">
      <Text className="text-gray-700 font-medium mb-2">Venue Name</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <GooglePlacesAutocomplete
            placeholder="Enter venue name"
            fetchDetails
            disableScroll
            query={query}
            onPress={(data, details = null) => {
              if (details) {
                const location = details.geometry?.location;
                const name = data.structured_formatting?.main_text;
                const address = data.structured_formatting?.secondary_text;

                onChange(name);
                // @ts-ignore
                setValue("address" as Path<T>, address ?? "");
                // @ts-ignore
                setValue("description" as Path<T>, data.description ?? "");
                // @ts-ignore
                setValue("latitude" as Path<T>, location?.lat ?? 0);
                // @ts-ignore
                setValue("longitude" as Path<T>, location?.lng ?? 0);
              }
            }}
            textInputProps={{
              value,
              onChangeText: onChange,
              onBlur: onBlur,
            }}
            styles={{
              container: {
                backgroundColor: "#f9fafb",
              },
              textInputContainer:{
                borderWidth: 1,
                borderRadius: 8,
                backgroundColor: "#f9fafb",
                borderColor: "#d1d5db",
              },
              textInput: {
                color: "#5d5d5d",
              }
            }}
          />
        )}
      />
      {errors?.address?.message && (
        <Text className="text-red-500 mt-1 text-sm">
          {errors?.address?.message}
        </Text>
      )}
      {(errors?.longitude || errors?.latitude) && (
        <Text className="text-red-500 mt-1 text-sm">
          Please select an address from the suggestions.
        </Text>
      )}
    </View>
  );
};

export default AddressInput;