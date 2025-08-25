import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Control, Controller } from 'react-hook-form';

interface RedemptionOptionProps {
  control: Control<any>; // Adjust 'any' to your form type
}

const RedemptionOption: React.FC<RedemptionOptionProps> = ({ control }) => (
  <View className="mb-4">
    <Text className="text-gray-700 font-medium mb-2">Redemption Option</Text>
    <Controller
      control={control}
      name="redemptionOption"
      render={({ field: { onChange, value } }) => (
        <View className="flex-row">
          <TouchableOpacity
            className={`py-3 px-4 mr-4 rounded-lg border ${value === 'redeemable' ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-100'}`}
            onPress={() => onChange('redeemable')}
          >
            <Text className={value === 'redeemable' ? 'text-blue-700 font-semibold' : 'text-gray-700'}>Redeemable</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`py-3 px-4 rounded-lg border ${value === 'non-redeemable' ? 'border-blue-500 bg-blue-100' : 'border-gray-300 bg-gray-100'}`}
            onPress={() => onChange('non-redeemable')}
          >
            <Text className={value === 'non-redeemable' ? 'text-blue-700 font-semibold' : 'text-gray-700'}>Non-Redeemable</Text>
          </TouchableOpacity>
        </View>
      )}
    />
  </View>
);

export default RedemptionOption;