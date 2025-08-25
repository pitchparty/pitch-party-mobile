import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { NotificationStore, NotificationType } from "./notification.types";

export const useNotificationStore = create<NotificationStore>()(
  persist(
    (set, get) => ({
      notifications: [],
      // Add notification and limit the store to 15
      addNotification: (notification: NotificationType) => {
        set((state) => {
          const newNotifications = [notification, ...state.notifications].slice(
            0,
            15
          );
          return { notifications: newNotifications };
        });
      },

      // Mark a notification as read by id
      markAsRead: (id: string) => {
        set((state) => ({
          notifications: state.notifications.map((notification) =>
            notification.id === id ? { ...notification, read: true } : notification
          ),
        }));
      },

      // Clear all notifications
      clearNotifications: () => {
        set({ notifications: [] });
      },
    }),
    {
      name: "onesignal_notification_storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
