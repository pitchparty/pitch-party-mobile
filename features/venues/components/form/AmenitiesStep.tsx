import React from 'react';
import { View, Text } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { VenueFormData } from '@/features/venues/schema';
import { MultiSelect } from '@/components/MultiSelect';
import { DEFAULT_AMENITIES } from '@/features/venues/constants';

interface AmenitiesStepProps {
  form: UseFormReturn<VenueFormData>;
}

const AmenitiesStep: React.FC<AmenitiesStepProps> = ({ form }) => {
  const { control, formState: { errors } } = form;

  return (
    <View className="p-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        What amenities does your venue offer?
      </Text>
      
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
      
      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Highlighting your venue's amenities can attract more customers.
      </Text>
    </View>
  );
};

export default AmenitiesStep;