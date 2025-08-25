import React from 'react';
import { View, Text } from 'react-native';
import { UseFormReturn } from 'react-hook-form';
import { VenueFormData } from '@/features/venues/schema';
import AddressInput from '@/components/AddressInput';

interface LocationStepProps {
  form: UseFormReturn<VenueFormData>;
}

const LocationStep: React.FC<LocationStepProps> = ({ form }) => {
  const { formState: { errors } } = form;

  return (
    <View className="p-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        Where is your venue located?
      </Text>
      
      <AddressInput 
        form={form} 
        label="Venue Address" 
        placeholder="Search for your venue location"
        error={errors.address?.message}
      />
      
      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-4">
        Providing an accurate address helps customers find your venue easily.
      </Text>
    </View>
  );
};

export default LocationStep;