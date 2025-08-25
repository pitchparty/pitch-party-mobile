type additionalObject = {
    screen: string;
    data?: Record<string, string>;
  };
  
  // Define the notification structure
  export type NotificationType = {
    id: string;
    title: string | undefined;
    body: string;
    additionalData: additionalObject | object | undefined;
    read: boolean;
    timestamp: number;
  };
  
  // Define the notification store
  export type NotificationStore = {
    notifications: NotificationType[];
    addNotification: (notification: NotificationType) => void; 
    markAsRead: (id: string) => void; 
    clearNotifications: () => void; 
  };