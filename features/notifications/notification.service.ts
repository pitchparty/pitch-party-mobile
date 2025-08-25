import { OneSignal, LogLevel } from "react-native-onesignal";
import {
  handleForegroundNotification,
  handleNotificationClick,
  handlePermissionChange,
} from "./notification.handler";

export class NotificationService {
  private static instance: NotificationService;
  private initialized = false;

  public setupListeners() {
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      handleForegroundNotification
    );
    OneSignal.Notifications.addEventListener("click", handleNotificationClick);
    OneSignal.Notifications.addEventListener(
      "permissionChange",
      handlePermissionChange
    );
  }

  public removeListeners() {
    OneSignal.Notifications.removeEventListener(
      "foregroundWillDisplay",
      handleForegroundNotification
    );
    OneSignal.Notifications.removeEventListener(
      "click",
      handleNotificationClick
    );
    OneSignal.Notifications.removeEventListener(
      "permissionChange",
      handlePermissionChange
    );
  }

  static getInstance(): NotificationService {
    if (!this.instance) {
      this.instance = new NotificationService();
    }
    return this.instance;
  }

  async initialize(userId?: string, role?: string) {
    if (this.initialized) return;

    OneSignal.initialize(process?.env?.EXPO_PUBLIC_ONESIGNAL_APP_ID || "");

    if (__DEV__) {
      OneSignal.Debug.setLogLevel(LogLevel.Verbose);
    }

    // Event Listeners
    OneSignal.Notifications.addEventListener(
      "foregroundWillDisplay",
      handleForegroundNotification
    );
    OneSignal.Notifications.addEventListener("click", handleNotificationClick);
    OneSignal.Notifications.addEventListener(
      "permissionChange",
      handlePermissionChange
    );

    if (userId && role) await this.setUserId(userId, role);

    this.initialized = true;
  }

  async setUserId(userId: string, role: string) {
    await OneSignal.login(userId);
    await OneSignal.User.addTag("role", role);
  }

  async removeUserId() {
    await OneSignal.logout();
  }
}
