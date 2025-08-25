import React from 'react';
import { View } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { VenueFormData } from '@/features/venues/schema';
import ThemedTextInput from '@/components/ui/ThemedTextInput';

interface BasicInfoStepProps {
  form: UseFormReturn<VenueFormData>;
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ form }) => {
  const { control, formState: { errors } } = form;

  return (
    <View className="p-6">
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Venue Name"
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
            placeholder="Sports Bar & Grill"
          />
        )}
      />
      
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Description"
            value={value}
            onChangeText={onChange}
            error={errors.description?.message}
            placeholder="A brief description of your venue"
            multiline
            numberOfLines={4}
          />
        )}
      />
      
      <Controller
        control={control}
        name="capacity"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Capacity"
            value={value}
            onChangeText={onChange}
            error={errors.capacity?.message}
            placeholder="100"
            keyboardType="number-pad"
          />
        )}
      />
    </View>
  );
};

export default BasicInfoStep;