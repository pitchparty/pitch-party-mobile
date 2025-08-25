export enum DeepLinkType {
  EMAIL_VERIFICATION = "email_verification",
  PASSWORD_RESET = "password_reset",
  CUSTOM_CALLBACK = "custom_callback",
}

export interface DeepLinkParams {
  type: DeepLinkType;
  accessToken?: string;
  refreshToken?: string;
  path?: string;
  errorCode?: string;
  errorDescription?: string;
  orderTrackingId?: string;
  orderMerchantReference?: string;
}

export interface DeepLinkConfig {
  scheme: string;
  prefixes: string[];
  screens: Record<string, string>;
}
