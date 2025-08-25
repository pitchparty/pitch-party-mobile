import { RedemptionOption } from "@/features/venues/types";
import React from "react";
import { Text, View } from "react-native";



// Props interface
interface BookingSelectionCardProps {
  title: string;
  justify?: boolean;
  children: React.ReactNode;
  className?: string;
  redemptionOption?: RedemptionOption;
}

// Functional Component
export const BookingSelectionCard: React.FC<BookingSelectionCardProps> = ({
  title,
  justify = false,
  children,
  className = '',
  redemptionOption,
}) => {
  const justifyClass = justify ? "flex-row items-center justify-between" : "";


  // Class for the redemption badge
  const redemptionClass =
    redemptionOption === RedemptionOption.Redeemable
    ? 'bg-red-100 text-red-800'
      : 'bg-green-100 text-green-800'

  return (
    <View className={`bg-white dark:bg-gray-800 rounded-2xl my-4 shadow-sm overflow-hidden ${className}`}>
      <View className="flex-row items-center justify-between bg-blue-100 dark:bg-gray-700 p-4">
        <Text className="text-lg font-semibold text-blue-900 dark:text-white">
          {title}
        </Text>
        {/* Show only if redemptionOption exists */}
        {redemptionOption && (
          <Text className={`text-xs font-medium px-2 rounded-full ${redemptionClass}`}>
            {redemptionOption.toLocaleUpperCase()}
          </Text>
        )}
      </View>

      <View className={`${justifyClass} mx-4 my-4`}>
        {children}
      </View>
    </View>
  );
};
