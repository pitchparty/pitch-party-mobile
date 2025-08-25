import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFERENCES_KEY = "notification-preferences";

export const loadPreferences = async () => {
  const stored = await AsyncStorage.getItem(PREFERENCES_KEY);
  return stored ? JSON.parse(stored) : { marketing: true, orderUpdates: true };
};

export const savePreferences = async (preferences: any) => {
  await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(preferences));
};

export const deletePreferences = async () => {
  await AsyncStorage.removeItem(PREFERENCES_KEY);
};