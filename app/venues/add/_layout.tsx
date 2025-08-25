import React, { useLayoutEffect } from "react";
import { View } from "react-native";
import { Stack, useNavigation, usePathname } from "expo-router";
import CreateAccountHeader from "@/features/create-account/components/Header";
import { SafeAreaView } from "react-native-safe-area-context";

const AddShopLayout = () => {
  const pathname = usePathname();
  const navigation = useNavigation();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  })

  const getProgressWidth = () => {
    if (pathname?.includes("new-shop")) {
      return "33%";
    } else if (pathname?.includes("upload-documents")) {
      return "66%";
    } else if (pathname?.includes("shop-review")) {
      return "100%";
    } else {
      return "0%";
    }
  };

  let headerTitle = "";
  let headerSubtitle = "";

  if (pathname?.includes("new-shop")) {
    headerTitle = "Create Your Venue";
    headerSubtitle = "Step 1 of 3: Venue Information";
  } else if (pathname?.includes("upload-documents")) {
    headerTitle = "Upload Documents";
    headerSubtitle = "Step 2 of 3: Verification Documents";
  } else if (pathname?.includes("shop-review")) {
    headerTitle = "Review Your Information";
    headerSubtitle = "Step 3 of 3: Final Review";
  }

  const CustomHeader = () => (
    <SafeAreaView className="w-full px-4 pb-2 pt-4 bg-white">
      <View className="h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
        <View
          className="h-full bg-blue-500 rounded-full"
          style={{ width: getProgressWidth() }}
        />
      </View>
      <CreateAccountHeader title={headerTitle} subtitle={headerSubtitle} />
    </SafeAreaView>
  );

  return (
    <Stack>
      <Stack.Screen
        name="new-shop"
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="upload-documents"
        options={{
          header: () => <CustomHeader />,
        }}
      />
      <Stack.Screen
        name="shop-review"
        options={{
          header: () => <CustomHeader />,
        }}
      />
    </Stack>
  );
};

export default AddShopLayout;
