import * as Linking from "expo-linking";
import { supabase } from "@/lib/supabase";
import { NavigationProp } from "@react-navigation/native";

import { DeepLinkConfig, DeepLinkParams, DeepLinkType } from "@/types/DeepLink";

export class DeepLinkHandler {
  private static instance: DeepLinkHandler;
  private navigation?: NavigationProp<any>;
  private config: DeepLinkConfig;

  private constructor(config: DeepLinkConfig) {
    this.config = config;
  }

  public static getInstance(config: DeepLinkConfig): DeepLinkHandler {
    if (!DeepLinkHandler.instance) {
      DeepLinkHandler.instance = new DeepLinkHandler(config);
    }
    return DeepLinkHandler.instance;
  }

  public setNavigation(navigation: NavigationProp<any>) {
    this.navigation = navigation;
  }

  private determineLinkType(
    path: string | null,
    params: Record<string, any>
  ): DeepLinkType {
    if (params.type === "recovery") return DeepLinkType.PASSWORD_RESET;
    if (params.type === "signup" || params.type === "email")
      return DeepLinkType.EMAIL_VERIFICATION;
    return DeepLinkType.CUSTOM_CALLBACK;
  }

  private parseUrl(url: string): DeepLinkParams | null {
    try {
      const parsed = Linking.parse(url);
      const { path, queryParams } = parsed;

      const cleanUrl = url.replace("#", "?");
      const cleanParsed = Linking.parse(cleanUrl);
      const cleanQueryParams = cleanParsed.queryParams || {};

      const type = this.determineLinkType(path, cleanQueryParams);
      return {
        type,
        accessToken: cleanQueryParams.access_token as string,
        refreshToken: cleanQueryParams.refresh_token as string,
        path: path || undefined,
        errorCode: cleanQueryParams.error as string,
        errorDescription: cleanQueryParams.error_description as string,
        orderTrackingId: cleanQueryParams.OrderTrackingId as string,
        orderMerchantReference:
          cleanQueryParams.OrderMerchantReference as string,
      };
    } catch (error) {
      console.error("Failed to parse deep link:", error);
      return null;
    }
  }

  private async handleAuthSession(params: DeepLinkParams) {
    if (params.accessToken && params.refreshToken) {
      const { data, error } = await supabase.auth.setSession({
        access_token: params.accessToken,
        refresh_token: params.refreshToken,
      });

      if (error) {
        console.error("Session setup failed:", error);
        return false;
      }
      return true;
    }
    return false;
  }

  public async processDeepLink(url: string) {
    const params = this.parseUrl(url);
    if (!params || !this.navigation) return;

    if (params.errorCode) {
      this.navigation.navigate("ErrorScreen", {
        errorCode: params.errorCode,
        errorDescription: params.errorDescription,
      });
      return;
    }

    switch (params.type) {
      case DeepLinkType.EMAIL_VERIFICATION:
        const verified = await this.handleAuthSession(params);
        if (verified) {
          this.navigation.navigate("(auth)/onboarding");
        }
        break;

      case DeepLinkType.PASSWORD_RESET:
        const resetSession = await this.handleAuthSession(params);
        if (resetSession) {
          this.navigation.navigate("(auth)/reset-password");
        }
        break;

      case DeepLinkType.CUSTOM_CALLBACK:
        console.info("------Custom callback received:--------", params);
        if (params.path === "bookings" && params.orderMerchantReference) {
          this.navigation.navigate(
            `/(user)/user-bookings`
          );
        } else if (params.path) {
          const screen = Object.entries(this.config.screens).find(
            ([_, path]) => path === params.path
          )?.[0];
          if (screen) this.navigation.navigate(screen);
        }
        break;
    }
  }
}

export default DeepLinkHandler;
