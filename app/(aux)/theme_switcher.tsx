// ThemeScreen.js
import React from "react";
import { colorScheme, useColorScheme } from "nativewind";
import { View, Text, TouchableOpacity } from "react-native";
import ThemeIllustration from "@/constants/ThemeIllustration";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import useIsomorphicLayoutEffect from '@/hooks/useIsomorphicLayoutEffect'


const ThemeScreen = () => {
  const { setColorScheme } = useColorScheme();
  const navigation = useNavigation();

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      headerTitle: "Theme Settings"
    });
  }, [navigation])

  const themes = [
    {
      id: "light",
      name: "Light",
      icon: 'sun',
      description: "Light theme for bright environments",
    },
    {
      id: "dark",
      name: "Dark",
      icon: 'moon',
      description: "Easy on the eyes in dark environments",
    },
  ];

  return (
    <View className="flex-1 bg-blue-50 dark:bg-gray-900">
      <View className="p-4 pt-20">
        <View className="items-center mb-8">
          <View className="w-[200px] h-[160px] mb-6">
            <ThemeIllustration theme={colorScheme.get()} />
          </View>
        </View>

        {themes.map((theme) => (
          <ThemeOption
            key={theme.id}
            theme={theme}
            colorScheme={colorScheme.get()}
            setSelectedTheme={() => setColorScheme(theme.id)}
          />
        ))}

        {/* <TButton
          label="Apply Theme"
          onPress={() => {
            console.log("Applying theme:", colorScheme);
          }}
        /> */}
      </View>
    </View>
  );
};

const ThemeOption = ({
  theme,
  colorScheme,
  setSelectedTheme,
}: {
  theme: { id: "light" | "dark" | "system"; name: string; icon: React.ComponentProps<typeof Feather>['name']; description: string };
  colorScheme: "light" | "dark" | undefined;
  setSelectedTheme: (theme: string) => void;
}) => {
  const isSelected = colorScheme === theme.id;
  const Icon = theme.icon;

  return (
    <TouchableOpacity
      onPress={() => setSelectedTheme(theme.id)}
      className={`p-4 rounded-xl bg-white dark:bg-gray-800 mb-3 flex-row items-center border-2 ${
        isSelected
          ? "border-gray-500 bg-gray-50 dark:bg-gray-900/20"
          : "border-gray-200 dark:border-gray-700"
      }`}
    >
      <View
        className={`w-10 h-10 rounded-full items-center justify-center mr-4 ${
          isSelected ? "bg-blue-500" : "bg-gray-100 dark:bg-gray-800"
        }`}
      >
        <Feather name={Icon} size={20} color={isSelected ? "#fff" : "#6B7280"} />
      </View>

      <View className="flex-1">
        <View className="flex-row items-center">
          <Text
            className={`font-medium text-lg ${
              isSelected
                ? "text-gray-500 dark:text-gray-300"
                : "text-gray-900 dark:text-gray-100"
            }`}
          >
            {theme.name}
          </Text>
          {isSelected && (
            <MaterialIcons
              name="check-circle"
              size={20}
              className="ml-2"
              color={isSelected ? "#507435" : "#6B7280"}
            />
          )}
        </View>
        <Text className="text-gray-500 dark:text-gray-400">
          {theme.description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ThemeScreen;
