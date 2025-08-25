import React from "react";
import colors from "tailwindcss/colors";
import { colorScheme } from "nativewind";
import { View, Text, StyleSheet } from "react-native";
import { Controller, UseFormReturn } from "react-hook-form";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

type AddressInputProps = {
  form: UseFormReturn<any>;
  label?: string;
  placeholder?: string;
  error?: string;
};

const query = {
  language: "en",
  components: "country:KE",
  key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
};

const AddressInput: React.FC<AddressInputProps> = ({
  form,
  label = "Venue Name",
  placeholder = "Search for your venue",
  error,
}) => {
  return (
    <Controller
      control={form.control}
      name="address"
      render={({ field: { onChange } }) => (
        <View style={styles.container}>
          {label && (
            <Text className="text-gray-700 dark:text-gray-300 mb-2">
              {label}
            </Text>
          )}
          <GooglePlacesAutocomplete
            placeholder={placeholder}
            fetchDetails
            onPress={(data, details = null) => {
              if (details) {
                onChange(data.structured_formatting.secondary_text);
                form.setValue("name", data.structured_formatting.main_text);
                form.setValue("description", data.description);
                // @ts-ignore
                form.setValue("average_rating", details?.rating || "0");
                form.setValue("latitude", details?.geometry?.location?.lat);
                form.setValue("longitude", details?.geometry?.location?.lng);
              }
            }}
            styles={{
              textInputContainer: {
                width: "100%",
              },
              textInput: error
                ? styles.errorContainer
                : [
                    styles.textInput,
                    {
                      backgroundColor:
                        colorScheme.get() === "dark"
                          ? colors.gray["700"]
                          : "white",
                      color: colorScheme.get() === "dark" ? "white" : "black",
                    },
                  ],
            }}
            query={query}
          />
          {error && <Text style={styles.error}>{error}</Text>}
        </View>
      )}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    padding: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
  errorContainer: {
    borderColor: "red",
    borderWidth: 2,
  },
});

export default AddressInput;
