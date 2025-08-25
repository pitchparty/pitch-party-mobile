import "react-native-reanimated";
import "react-native-get-random-values";

import { useEffect } from "react";
import { useFonts } from "expo-font";
import * as Network from "expo-network";
import { AppState } from "react-native";
import { Toaster } from "sonner-native";
import { StatusBar } from "expo-status-bar";
import * as WebBrowser from "expo-web-browser";
import { useNavigationContainerRef, Stack } from "expo-router";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import {
  QueryClient,
  QueryClientProvider,
  onlineManager,
} from "@tanstack/react-query";



import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";

import { useReactQueryDevTools } from "@dev-plugins/react-query";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useReactNavigationDevTools } from "@dev-plugins/react-navigation";

import "../global.css";

import { supabase } from "@/lib/supabase";
import { DeepLinkConfig } from "@/types/DeepLink";
import { useDeepLink } from "@/hooks/useDeepLink";
import { screenOptions } from "@/constants/Colors";
import { useColorScheme } from "@/hooks/useColorScheme";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import AuthMiddleware from "@/features/authentication/middleware";

// LogBox.ignoreAllLogs();

WebBrowser.maybeCompleteAuthSession();

const deepLinkConfig: DeepLinkConfig = {
  scheme: "pitchparty",
  prefixes: ["pitchparty://"],
  screens: {
    Bookings: "bookings",
    VerificationSuccess: "/(auth)/onboarding",
    ResetPassword: "/(auth)/reset-password",
    ErrorScreen: "error",
  },
};

AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});


function RootLayout() {
  const colorScheme = useColorScheme();
  const queryClient = new QueryClient();
  const navigationRef = useNavigationContainerRef();

  useReactNavigationDevTools(navigationRef);
  useReactQueryDevTools(queryClient);
  useDeepLink(deepLinkConfig);
  configureReanimatedLogger({
    level: ReanimatedLogLevel.warn,
    strict: false,
  });


  useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    const unsubscribe = Network.addNetworkStateListener((state) => {
      onlineManager.setOnline(!!state.isConnected);
    });
    return () => unsubscribe.remove();
  }, []);



  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <GestureHandlerRootView>
          <BottomSheetModalProvider>
            <AuthMiddleware>
              <StatusBar style="auto" />
              <Stack screenOptions={screenOptions} initialRouteName="(auth)">
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(manager)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="(admin)" options={{ headerShown: false }} />
                <Stack.Screen name="(user)" options={{ headerShown: false }} />
                <Stack.Screen name="(aux)" options={{ headerShown: false }} />
                <Stack.Screen name="venues" options={{ headerShown: false }} />
                <Stack.Screen name="+not-found" />
              </Stack>

            </AuthMiddleware>
            <Toaster />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default RootLayout;
