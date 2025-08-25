import { router } from "expo-router";
import { Platform, Linking, Alert } from 'react-native';

import * as Sharing from "expo-sharing";
import { toast } from "sonner-native";

const inviteFriend = async () => {
  console.log("HELLO")
  const message = "Hey! Join me on this awesome app: https://yourapp.com";
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(message);
  } else {
    alert("Sharing is not available on this device.");
  }
};

const rateMyApp = async () => {
  const iosAppStoreUrl = 'itms-apps://itunes.apple.com/app/idYOUR_IOS_APP_ID';
  const androidPlayStoreUrl = 'https://play.google.com/store/apps/details?id=com.tumeloinnovations.pitchparty&pli=1';

  const storeUrl = Platform.OS === 'ios' ? iosAppStoreUrl : androidPlayStoreUrl;

  try {
    const supported = await Linking.canOpenURL(storeUrl);
    if (supported) {
      await Linking.openURL(storeUrl);
    } else {
      Alert.alert('Error', 'Could not open the store link.');
    }
  } catch (error) {
    console.error('Error opening store URL:', error);
    Alert.alert('Error', 'Something went wrong. Please try again later.');
  }
};

const accountSettings = [
  // {
  //   id: "1",
  //   title: "Edit Profile",
  //   icon: "person-outline",
  //   onPress: () => router.navigate("/edit-profile"),
  // },
  // {
  //   id: "3",
  //   title: "Notification Settings",
  //   icon: "notifications-none",
  //   subtitle: "Configure your notification preferences",
  //   onPress: () => router.navigate("/notification_settings"),
  // },
  {
    id: "4",
    title: "Theme Settings",
    icon: "color-palette-outline",
    subtitle: "Choose your preferred theme",
    onPress: () => router.navigate("/theme_switcher"),
  },
  // {
  //   id: "5",
  //   title: "Location",
  //   icon: "location-on",
  //   subtitle: "View and manage your location",
  //   onPress: () => router.navigate("/"),
  // },
];

const venueManagementSettings = [
  {
    id: "1",
    title: "My Venues",
    icon: "map-outline",
    onPress: () => router.navigate("/venues/venues"),
  },
  {
    id: "2",
    title: "Add Venue",
    icon: "add-circle-outline",
    onPress: () => router.navigate("/venues/add"),
  },
  // {
  //   id: "3",
  //   title: "Manage Venues",
  //   icon: "settings-outline",
  //   onPress: () => router.navigate("/manage_venues"),
  // },
  // {
  //   id: "4",
  //   title: "Delete Venue",
  //   icon: "trash-outline",
  //   onPress: () => router.navigate("/delete_venue"),
  // },
]


const generalSettings = [
  {
    id: "1",
    title: "Help & Support",
    subtitle: "Help center, contact us, privacy policy",
    icon: "help-outline",
    onPress: () => router.navigate("/help-center"),
  },
  {
    id: "2",
    title: "Rate App",
    subtitle: "Rate this app on the store",
    icon: "star-outline",
    onPress: rateMyApp,
  },
  {
    id: "3",
    title: "Invite a Friend",
    subtitle: "Invite a friend to download the app",
    icon: "link",
    onPress: inviteFriend,
  },
  {
    id: "4",
    title: "About App",
    icon: "phone-portrait-outline",
    subtitle: "Version 1.0.0",
    onPress: () => router.navigate("/about_app"),
  },
];

const helpCenterSettings = [
  {
    id: "1",
    title: "Help & Support",
    subtitle: "Get help with your account or app",
    icon: "help-outline",
    onPress: () => router.navigate("/contact-us"),
  },
  {
    id: "2",
    title: "FAQ",
    subtitle: "Frequently asked questions",
    icon: "help-buoy-sharp",
    onPress: () => router.navigate("/faq"),
  },
  {
    id: "3",
    title: "Privacy Policy",
    subtitle: "Privacy policy and data protection",
    icon: "document-text-outline",
    onPress: () => {},
  },
  {
    id: "4",
    title: "Terms of Service",
    subtitle: "Terms of service and conditions",
    icon: "document-text-outline",
    onPress: () => {},
  },
];

export { accountSettings, generalSettings, helpCenterSettings, venueManagementSettings };
