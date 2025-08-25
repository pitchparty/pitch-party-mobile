import * as Sharing from 'expo-sharing';

export const inviteFriend = async () => {
  const message = "Hey! Join me on this awesome app: https://yourapp.com";
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(message);
  } else {
    alert("Sharing is not available on this device.");
  }
};
