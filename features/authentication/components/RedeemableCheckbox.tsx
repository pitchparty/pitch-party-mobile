import React from "react";
import Checkbox from "expo-checkbox";
import { Ionicons } from "@expo/vector-icons";
import { UseFormReturn } from "react-hook-form";
import { Alert, Text, View } from "react-native";

type RedeemableCheckboxProps = {
  form: UseFormReturn<any>;
};

const RedeemableCheckbox = ({ form }: RedeemableCheckboxProps) => {
  const showTooltip = (message: string) => {
    Alert.alert("Info", message);
  };
  return (
    <View className="p-4 bg-white dark:bg-gray-800 rounded-lg mb-6">
      <Text className="text-lg font-bold mb-4 text-gray-900 dark:text-gray-200">
        Select Redemption Option:
      </Text>

      {/* Redeemable */}
      <View className="flex-row items-center space-x-3 mb-4">
        <Checkbox
          className="mr-3"
          value={form.watch("redemption_option") === "redeemable"}
          onValueChange={() => form.setValue("redemption_option", "redeemable")}
          color={
            form.watch("redemption_option") === "redeemable"
              ? "#007bff"
              : undefined
          }
        />
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-base text-gray-900 dark:text-gray-200 mr-2">
            Redeemable
          </Text>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="gray"
            onPress={() =>
              showTooltip(
                "This option allows the item to be redeemed for value."
              )
            }
          />
        </View>
      </View>

      {/* Non-Redeemable */}
      <View className="flex-row items-center">
        <Checkbox
          className="mr-3"
          value={form.watch("redemption_option") === "non-redeemable"}
          onValueChange={() =>
            form.setValue("redemption_option", "non-redeemable")
          }
          color={
            form.watch("redemption_option") === "non-redeemable"
              ? "#007bff"
              : undefined
          }
        />
        <View className="flex-1 flex-row items-center justify-between">
          <Text className="text-base text-gray-900 dark:text-gray-200 mr-2">
            Non-Redeemable
          </Text>
          <Ionicons
            name="information-circle-outline"
            size={20}
            color="gray"
            onPress={() =>
              showTooltip(
                "This option allows the item to be redeemed for value."
              )
            }
          />
        </View>
      </View>
    </View>
  );
};

export default RedeemableCheckbox;
