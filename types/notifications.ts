import { ExternalPathString, RelativePathString } from "expo-router";

export type NotificationData = {
    screen: RelativePathString | ExternalPathString;
    params?: Record<string, string>;
};
