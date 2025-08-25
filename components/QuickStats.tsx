import React from "react";
import { Ionicons } from "@expo/vector-icons";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { colorScheme } from "nativewind";

interface QuickStat {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  isLoading?: boolean;
  isError?: boolean;
  onRefresh?: () => void;
}

const QuickStats: React.FC<QuickStat> = ({
  title,
  value,
  icon,
  color,
  isLoading,
  isError,
  onRefresh,
}) => {
  return (
    <View
      className="bg-white dark:bg-gray-700 p-4 rounded-xl shadow-sm"
      style={{ width: "48%", marginBottom: 16 }}
    >
      <View className="flex-row items-center justify-between mb-3">
        <View
          style={{ backgroundColor: `${color}20` }}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <Ionicons
            name={icon as keyof typeof Ionicons.glyphMap}
            size={16}
            color={color}
          />
        </View>

        {onRefresh && (
          <TouchableOpacity
            onPress={onRefresh}
            className="p-2 rounded-full"
            disabled={isLoading}
          >
            <Ionicons
              name="refresh"
              size={12}
              color={isLoading ? "#ccc" : "#888"}
              style={isLoading ? { opacity: 0.7 } : {}}
            />
          </TouchableOpacity>
        )}
      </View>
      <Text className="text-gray-600 dark:text-gray-400 text-sm">{title}</Text>
      {isLoading ? (
        <View className="h-8 justify-start text-left">
          <ActivityIndicator
            size="small"
            color={colorScheme.get() === "dark" ? "#fff" : "#000"}
          />
        </View>
      ) : isError ? (
        <Text className="text-red-500 text-sm">Error loading data</Text>
      ) : (
        <Text className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {value}
        </Text>
      )}
    </View>
  );
};

export default QuickStats;
