import {
  GestureResponderEvent,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { Ionicons } from "@expo/vector-icons";
import colors from "tailwindcss/colors";

const MenuSection = ({ title, items }: any) => (
  <View className="mt-6">
    <Text className="px-4 text-sm font-medium text-gray-500 dark:text-gray-400 uppercase">
      {title}
    </Text>
    <View className="mt-2 bg-white dark:bg-gray-800 rounded-2xl">
      {items.map(
        (
          item: {
            id: React.Key | null | undefined;
            onPress: ((event: GestureResponderEvent) => void) | undefined;
            icon: React.ComponentProps<typeof Ionicons>["name"];
            title: string;
            subtitle: string;
            status?: "warning" | "success" | "error" | "info" | "ok";
          },
          index: number
        ) => (
          <TouchableOpacity
            key={item.id}
            className={`flex-row items-center px-4 py-4 ${
              index !== items.length - 1
                ? "border-b border-gray-100 dark:border-gray-700"
                : ""
            }`}
            onPress={item.onPress}
          >
            <View className="w-8 h-8 mr-4 bg-gray-200 dark:bg-gray-700 rounded-full items-center justify-center">
              <Ionicons
                name={item.icon}
                size={20}
                color={colors.gray[500]}
              />
            </View>
            <View className="flex-1">
       
              <View className="flex-row items-center">
              {item.status === "warning" && (
                <Ionicons
                  name="warning-outline"
                  size={16}
                  color="orange"
                  style={{ marginRight: 6 }}
                />
              )}
                <Text className="text-gray-900 dark:text-gray-100 font-medium">
                  {item.title}
                </Text>
              </View>
              {item.subtitle && (
                <Text className="text-gray-500 dark:text-gray-400 text-sm">
                  {item.subtitle}
                </Text>
              )}
            </View>
            <Ionicons
              name="chevron-forward-sharp"
              size={24}
              color={colors.gray[400]}
            />
          </TouchableOpacity>
        )
      )}
    </View>
  </View>
);

export default MenuSection;