import React from "react";
import { ScrollView } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  initialVenueValues,
  venueSchema,
  VenueSchemaPayload,
} from "@/features/venues/schema";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import { MultiSelect } from "@/components/MultiSelect";
import AddressInput from "@/components/AddressInput";
import { DEFAULT_AMENITIES } from "../../constants";
import ThemedButton from "@/components/ui/ThemedButton";

type VenueFormProps = {
  initialValues?: Partial<VenueSchemaPayload>;
  onSubmit: (data: VenueSchemaPayload) => void;
  buttonLabel?: string;
};

const VenueForm: React.FC<VenueFormProps> = ({
  initialValues = initialVenueValues,
  onSubmit,
  buttonLabel = "Submit",
}) => {
  const form = useForm<VenueSchemaPayload>({
    resolver: zodResolver(venueSchema),
    defaultValues: initialValues as VenueSchemaPayload,
    mode: "onChange"
  });


  return (
    <ScrollView
      className="flex-1 bg-blue-50 dark:bg-gray-900 p-6"
      keyboardShouldPersistTaps="handled"
    >
      <Controller
        control={form.control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Venue Name"
            value={value}
            onChangeText={onChange}
            error={form.formState.errors.name?.message}
            placeholder="Sports Bar & Grill"
          />
        )}
      />
      <AddressInput form={form}  />
      <Controller
        control={form.control}
        name="capacity"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Capacity"
            value={value}
            onChangeText={(text) => onChange(text)}
            error={form.formState.errors.capacity?.message}
            placeholder="100"
            keyboardType="number-pad"
          />
        )}
        rules={{
          required: "Capacity is required",
          validate: (value) => /^[0-9]+$/.test(value) || "Capacity must be a valid number",
           
        }}
      />
      <Controller
        control={form.control}
        name="amenities"
        render={({ field: { onChange, value } }) => (
          <MultiSelect
            label="Amenities"
            options={DEFAULT_AMENITIES}
            value={value || []}
            onChange={onChange}
            canAddNew
          />
        )}
      />
      <ThemedButton label={buttonLabel} onPress={form.handleSubmit(onSubmit)} />
    </ScrollView>
  );
};

export default VenueForm;
