import { router } from "expo-router";

import { useNotificationStore } from "./notification.store";
import { NotificationClickEvent, NotificationWillDisplayEvent } from "react-native-onesignal";
import { toast } from "sonner-native";
import { NotificationType } from "./notification.types";

export const handleForegroundNotification = (event: NotificationWillDisplayEvent) => {
  const { notification } = event;
  const store = useNotificationStore.getState();

  store.addNotification({
    id: notification.notificationId,
    title: notification.title,
    body: notification.body,
    additionalData: notification.additionalData,
    read: false,
    timestamp: Date.now(),
  });

  toast.info(notification?.title || "", { description: notification?.body || "" });

  event.notification.display();
};

export const handleNotificationClick = (event: NotificationClickEvent) => {
  // @ts-ignore
  const { screen, data } = event.additionalData || { screen: "/", data: {} };
  router.push({
    pathname: screen || "",
    params: data || {},
  });
};

export const handlePermissionChange = (granted: boolean) => {
  console.log("Permission changed:", granted);
};
