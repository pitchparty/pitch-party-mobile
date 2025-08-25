import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
  Image,
} from "react-native";
import { format } from "date-fns";
import colors from "tailwindcss/colors";
import * as Updates from "expo-updates";
import { useColorScheme } from "nativewind";
import { Ionicons } from "@expo/vector-icons";
import * as Application from "expo-application";

interface FeatureCardProps {
  // icon: LucideIcon;
  title: string;
  description: string;
}

interface LinkButtonProps {
  icon: string;
  title: string;
  onPress: () => void;
}

const AboutScreen: React.FC = () => {
  const {colorScheme} = useColorScheme();
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [buildTime, setBuildTime] = useState<string | null>(null);

  useEffect(() => {
    checkForUpdates();
    const installationType = async () => {
      let time = await Application.getInstallationTimeAsync();
      return time;
    };
    installationTime();
    async function installationTime() {
      const time = await installationType();
      const formattedTime = format(time, "dd/MM/yyyy");
      setBuildTime(formattedTime);
    }
  }, []);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setUpdateAvailable(true);
      }
    } catch (error) {
      console.error("Error checking for updates", error);
    }
  };

  const handleUpdateApp = async () => {
    try {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    } catch (error) {
      Alert.alert(
        "Update Failed",
        "Could not download the latest version. Please try again later."
      );
    }
  };

  const FeatureCard: React.FC<FeatureCardProps> = ({
    title,
    description,
  }) => (
    <View className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl m-4 p-4 flex-row items-start mb-4">
      <View className="flex-1">
        <Text className="text-gray-900 dark:text-gray-100 font-semibold text-lg mb-1">
          {title}
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 leading-relaxed">
          {description}
        </Text>
      </View>
    </View>
  );

  const LinkButton: React.FC<LinkButtonProps> = ({
    icon,
    title,
    onPress,
  }) => (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl mb-2"
    >
      <View className="flex-row items-center">
        <Ionicons name={icon as keyof typeof Ionicons.glyphMap} size={20} color={colors.blue[500]} />
        <Text className="ml-3 text-gray-900 dark:text-gray-100 font-medium">
          {title}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.blue[500]} />
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 bg-blue-50 dark:bg-gray-900">
      <View className="items-center pt-8 pb-6 px-4">
        <View className="w-36 h-36 border-2 border-gray-300 bg-white dark:bg-gray-700 rounded-3xl mb-4 items-center justify-center">
          <Image
            source={colorScheme === "light" ? require("@/assets/images/blue_logo.png") : require("@/assets/images/white_logo.png")}
            style={{ height: 100, width: 100, resizeMode: "cover" }}
          />
        </View>
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          PitchParty
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-center max-w-[300px]"></Text>
        <View className="flex-row items-center">
          <View className="bg-gray-500 dark:bg-gray-800 rounded-full px-3 py-1 mr-2">
            <Text className="text-gray-100 dark:text-gray-300 font-medium">
              v{Application.nativeBuildVersion}
            </Text>
          </View>
          <View className="bg-gray-500 dark:bg-gray-800 rounded-full px-3 py-1">
            <Text className="text-gray-100 dark:text-gray-300 font-medium">
              Build {buildTime}
            </Text>
          </View>
        </View>

        {updateAvailable && (
          <TouchableOpacity
            onPress={handleUpdateApp}
            className="bg-blue-500 dark:bg-blue-600 rounded-full px-4 py-2 mb-4"
          >
            <Text className="text-white font-medium">Update Available</Text>
          </TouchableOpacity>
        )}
      </View>

      <FeatureCard
        title="About App"
        description="Pitch Party is the ultimate app for sports fans to book vibrant venues for watching live games. Discover, reserve, and cheer at the best sports bars, pubs, or event spaces in real time. Enjoy exclusive deals, group bookings, and never miss a match with friends again!"
        />

      <View className="px-4 py-6">
        <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Connect With Us
        </Text>
        {/* <LinkButton
          icon={'globe'}
          title="Visit our website"
          onPress={() => Linking.openURL("https://www.aatf-africa.org/")}
        /> */}
        <LinkButton
          icon={'logo-twitter'}
          title="Follow us on Twitter"
          onPress={() => Linking.openURL("https://x.com/pitchpartylive")}
        />
        <LinkButton
          icon={"logo-facebook"}
          title="Like us on Facebook"
          onPress={() => Linking.openURL("https://web.facebook.com/aatfafrica")}
        />
        <LinkButton
          icon={"logo-linkedin"}
          title="Connect with us on LinkedIn"
          onPress={() =>
            Linking.openURL(
              "https://www.linkedin.com/company/african-agricultural-technology-foundation"
            )
          }
        />
        {/* <LinkButton
          icon={"logo-youtube"}
          title="Subscribe to our YouTube channel"
          onPress={() =>
            Linking.openURL(
              "https://www.youtube.com/channel/UCnesohvW6SR0LrbjRolKKLw"
            )
          }
        /> */}
        <LinkButton
          icon={'mail'}
          title="Send us feedback"
          onPress={() => Linking.openURL("mailto:pitchparty@gmail.com")}
        />
      </View>

      <View className="px-4 py-6 items-center">
        <Text className="text-gray-500 dark:text-gray-400 text-sm text-center">
          © {new Date().getFullYear()} PitchParty. All rights reserved.
        </Text>
      </View>

      <View className="h-8" />
    </ScrollView>
  );
};

export default AboutScreen;
