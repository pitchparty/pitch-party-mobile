import React from "react";
import { ScrollView } from "react-native";

import MenuSection from "@/components/MenuSection";
import { helpCenterSettings } from "@/constants/settings";

const HelpCenter = () => {
  return (
    <ScrollView className="flex-1 px-4 bg-blue-50 dark:bg-gray-900">
      <MenuSection title="Help Center" items={helpCenterSettings} />
    </ScrollView>
  );
};

export default HelpCenter;
