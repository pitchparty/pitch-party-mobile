import React from 'react';
import { View, Text } from 'react-native';
import { Controller, UseFormReturn } from 'react-hook-form';
import { VenueFormData } from '@/features/venues/schema';
import ThemedTextInput from '@/components/ui/ThemedTextInput';

interface ContactInfoStepProps {
  form: UseFormReturn<VenueFormData>;
}

const ContactInfoStep: React.FC<ContactInfoStepProps> = ({ form }) => {
  const { control, formState: { errors } } = form;

  return (
    <View className="p-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        How can customers contact your venue?
      </Text>
      
      <Controller
        control={control}
        name="contact_phone"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Contact Phone"
            value={value}
            onChangeText={onChange}
            error={errors.contact_phone?.message}
            placeholder="123-456-7890"
            keyboardType="phone-pad"
          />
        )}
      />
      
      <Controller
        control={control}
        name="contact_email"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Contact Email"
            value={value}
            onChangeText={onChange}
            error={errors.contact_email?.message}
            placeholder="venue@example.com"
            keyboardType="email-address"
          />
        )}
      />
      
      <Controller
        control={control}
        name="pricing"
        render={({ field: { onChange, value } }) => (
          <ThemedTextInput
            label="Pricing (per hour)"
            value={value}
            onChangeText={onChange}
            error={errors.pricing?.message}
            placeholder="100"
            keyboardType="number-pad"
          />
        )}
      />
    </View>
  );
};

export default ContactInfoStep;