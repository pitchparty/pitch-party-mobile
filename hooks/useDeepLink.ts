import { Linking } from "react-native";
import { useNavigation } from "expo-router";
import { useCallback, useEffect } from "react";

import { DeepLinkConfig } from "@/types/DeepLink";
import DeepLinkHandler from "@/services/deepLinkHandler";

export const useDeepLink = (config: DeepLinkConfig) => {
  const navigation = useNavigation();
  const handler = DeepLinkHandler.getInstance(config);

  const handleUrl = useCallback(
    async (event: { url: string }) => {
      await handler.processDeepLink(event.url);
    },
    [handler]
  );

  useEffect(() => {
    handler.setNavigation(navigation);

    // Handle initial URL (app opened via deep link)
    Linking.getInitialURL().then((url) => {
      if (url) handler.processDeepLink(url);
    });

    // Handle URL while app is running
    const subscription = Linking.addEventListener("url", handleUrl);

    return () => {
      subscription.remove();
    };
  }, [navigation, handleUrl]);
};
