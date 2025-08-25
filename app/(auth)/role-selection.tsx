import React from "react";
import { Image } from "expo-image";
import { router } from "expo-router";
import colors from "tailwindcss/colors";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import { View, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const RoleSelection = () => {
  const { colorScheme } = useColorScheme();

  const logo =
    colorScheme == "dark"
      ? require("../../assets/images/white_logo.png")
      : require("../../assets/images/blue_logo.png");

  return (
    <SafeAreaView className="flex-1 bg-blue-50 dark:bg-gray-900">
      <View className="px-6 pt-12 items-center">
        <Text className="text-2xl font-bold mb-3  text-gray-800 dark:text-white">
          Join Pitch Party
        </Text>
        <Text className="text-base text-gray-600 mb-8  dark:text-gray-400">
          Select how you want to use Pitch Party
        </Text>
      </View>

      <View className="items-center justify-center my-4 mt-10">
        <Image
          source={logo}
          style={{ width: 200, height: 200 }}
          contentFit="contain"
        />
      </View>

      <View className="px-6 flex-1 justify-center">
        <TouchableOpacity
          onPress={() => router.push(`/(auth)/sign-up?role=user`)}
          className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-6 mb-4 flex-row items-center"
        >
          <Ionicons name="person" size={24} color={colors.blue[500]} />
          <View className="ml-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white">
              Sports Fan
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              Book venues and watch games with friends
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push(`/(auth)/(manager-onboarding)/step-one`)}
          className="bg-white dark:bg-gray-800 border border-gray-200 rounded-xl p-6 flex-row items-center"
        >
          <Ionicons name="business" size={24} color={colors.blue[500]} />
          <View className="ml-4">
            <Text className="text-lg font-semibold text-gray-800 dark:text-white">
              Venue Manager
            </Text>
            <Text className="text-gray-600 dark:text-gray-400">
              List your venue and attract sports fans
            </Text>
          </View>
        </TouchableOpacity>
      </View>
      <View className="flex-row justify-center items-center px-6 pb-8">
        <Text className="text-gray-600">Already have an account?</Text>
        <TouchableOpacity
          className="ml-2"
          onPress={() => router.navigate("/(auth)/onboarding")}
        >
          <Text className="text-blue-600 font-semibold">Sign In</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default RoleSelection;
