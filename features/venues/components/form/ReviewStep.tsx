import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { UseFormReturn } from 'react-hook-form';
import { VenueFormData } from '@/features/venues/schema';
import { Ionicons } from '@expo/vector-icons';

interface ReviewStepProps {
  form: UseFormReturn<VenueFormData>;
}

const ReviewStep: React.FC<ReviewStepProps> = ({ form }) => {
  const { getValues } = form;
  const values = getValues();

  const renderField = (label: string, value: string | string[] | undefined, icon: string) => {
    if (!value || (Array.isArray(value) && value.length === 0)) return null;
    
    return (
      <View className="flex-row items-start mb-4">
        <Ionicons name={icon as any} size={20} color="#3B82F6" className="mt-1" />
        <View className="ml-3 flex-1">
          <Text className="text-gray-500 dark:text-gray-400 text-sm">{label}</Text>
          {Array.isArray(value) ? (
            <View className="flex-row flex-wrap mt-1">
              {value.map((item, index) => (
                <View key={index} className="bg-blue-100 dark:bg-blue-900 rounded-full px-2 py-1 mr-2 mb-2">
                  <Text className="text-blue-800 dark:text-blue-200">{item}</Text>
                </View>
              ))}
            </View>
          ) : (
            <Text className="text-gray-800 dark:text-gray-200 text-base">{value}</Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className="p-6">
      <Text className="text-lg font-bold text-gray-800 dark:text-gray-100 mb-4">
        Review Your Venue Information
      </Text>
      
      <View className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
        {renderField('Venue Name', values.name, 'business-outline')}
        {renderField('Description', values?.description, 'information-circle-outline')}
        {renderField('Capacity', values.capacity, 'people-outline')}
        {renderField('Address', values.address, 'location-outline')}
        {renderField('Amenities', values.amenities, 'list-outline')}
        {renderField('Contact Phone', values.contact_phone, 'call-outline')}
        {renderField('Contact Email', values.contact_email, 'mail-outline')}
        {renderField('Pricing', values.pricing ? `$${values.pricing}/hr` : undefined, 'cash-outline')}
      </View>
      
      <Text className="text-sm text-gray-500 dark:text-gray-400 mt-4 text-center">
        Please review the information above before submitting. You can go back to make changes if needed.
      </Text>
    </View>
  );
};

export default ReviewStep;