import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

type MetricCardProps = {
  title: string;
  value: string | number;
  period: string;
  icon: string;
  color: string;
  isLoading?: boolean;
};

const MetricCard = ({
  title,
  value,
  period,
  icon,
  color,
  isLoading,
}: MetricCardProps) => {
  return (
    <View
      className="rounded-xl overflow-hidden shadow-sm my-2"
      style={{ width: "48%" }}
    >
      <View className={`${color} p-4 rounded-t-xl`}>
        <View className="flex-row justify-between items-center">
          {isLoading ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-xl">
              {Number(value).toLocaleString()}
            </Text>
          )}
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={24}
            color="white"
          />
        </View>
        <Text className="text-white text-xs mt-1">{period}</Text>
      </View>
      <View className="bg-white dark:bg-gray-800 p-3 rounded-b-xl">
        <Text className="font-semibold text-gray-800 dark:text-gray-200">
          {title}
        </Text>
      </View>
    </View>
  );
};

export default MetricCard;

const styles = StyleSheet.create({});
