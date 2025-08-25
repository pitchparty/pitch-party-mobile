import { useEffect } from "react";
import { OneSignal } from "react-native-onesignal";

import { NotificationService } from "./notification.service";

export const useNotificationSetup = () => {
    useEffect(() => {
        const service = NotificationService.getInstance();
        service.setupListeners();
    
        const setup = async () => {
            const permission = await OneSignal.Notifications.getPermissionAsync();
            if (!permission) await OneSignal.Notifications.requestPermission(true);
        };
    
        setup();
    
        return () => {
            service.removeListeners();
        };
    }, []);
  };
  