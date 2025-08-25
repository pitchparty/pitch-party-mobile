import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Slot, usePathname } from "expo-router";
import CreateAccountHeader from "@/features/create-account/components/Header"; // Import the header
import { useManagerOnboardingStore } from "@/features/create-account/store/managerOnboardingStore";
import { SafeAreaView } from "react-native-safe-area-context";

const ManagerOnboardingLayout = () => {
  const pathname = usePathname();
  const { setOnboardingProgress } = useManagerOnboardingStore()

  const getProgressWidth = () => {
    if (pathname?.includes("step-one")) {
      return "25%";
    } else if (pathname?.includes("step-two")) {
      return "50%";
    } else if (pathname?.includes("step-three")) {
      return "75%";
    } else if (pathname?.includes("review")) {
      return "100%";
    } else {
      return "0%";
    }
  };

  let headerTitle = "";
  let headerSubtitle = "";

  if (pathname?.includes("step-one")) {
    headerTitle = "Create Your Account";
    headerSubtitle = "Step 1 of 4: Personal Information";
  } else if (pathname?.includes("step-two")) {
    headerTitle = "Create Your Shop";
    headerSubtitle = "Step 2 of 4: Shop Information";
  } else if (pathname?.includes("step-three")) {
    headerTitle = "Upload Documents";
    headerSubtitle = "Step 3 of 4: Verification Documents";
  } else if (pathname?.includes("review")) {
    headerTitle = "Review Your Information";
    headerSubtitle = "Step 4 of 4: Final Review";
  }

  return (
    <SafeAreaView className="flex-1  bg-white dark:bg-gray-900 px-2">
      <View className="px-4 mt-2">
        <View className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <TouchableOpacity onPress={() => setOnboardingProgress({
             managerId: null,
             shopId: null,
             documentsUploaded: false,
             photosUploaded: false,
          })}>
            <View
            className="h-full bg-blue-500 rounded-full"
            style={{ width: getProgressWidth() }}
          /></TouchableOpacity>
        </View>
        <CreateAccountHeader title={headerTitle} subtitle={headerSubtitle} />
      </View>

      <Slot />
    </SafeAreaView>
  );
};

export default ManagerOnboardingLayout;
