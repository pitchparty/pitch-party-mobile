import React from "react";
import { Stack } from "expo-router";

import { screenOptions } from "@/constants/Colors";

const Layout = () => {
  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="about_app" options={{ title: 'About App' }}/>
      <Stack.Screen name="privacy-policy" options={{ title: 'Privacy Policy' }}/>
      <Stack.Screen name="terms-service" options={{ title: 'Terms of Service' }}/>
      <Stack.Screen name="theme_switcher" options={{ title: 'Theme Switcher' }}/>
      <Stack.Screen name="notification_settings" options={{ title: 'Notification Settings' }}/>
      <Stack.Screen name="faq" options={{ title: 'FAQ' }}/>
      <Stack.Screen name="help-center" options={{ title: 'Help Center' }}/>
    </Stack>
  );
};

export default Layout;
