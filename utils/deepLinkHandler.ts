import { router } from 'expo-router';
import type { NotificationData } from '../types/notifications';

export const handleDeepLink = (data: NotificationData) => {
    if (data.screen) {
        router.push({
            pathname: data.screen,
            params: data.params,
        });
    }
};
