import React from "react";
import { useNavigation } from "expo-router";
import { zodResolver } from "@hookform/resolvers/zod";
import { ScrollView, View } from "react-native";
import { useForm, SubmitHandler, Controller } from "react-hook-form";

import ThemedButton from "@/components/ui/ThemedButton";
import { useAuthStore } from "@/features/authentication/store";
import { DatePickerInput } from "@/components/DatePickerInput";
import ThemedTextInput from "@/components/ui/ThemedTextInput";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import {
  ProfileFormData,
  profileSchema,
} from "@/features/authentication/schema";

const EditProfilePage = () => {
  const navigation = useNavigation();
  const user = useAuthStore((state) => state.user);

  // Form setup
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name:user?.first_name || "",
      last_name:user?.last_name || "",
      username:user?.username || "",
      email: user?.email || "",
      date_of_birth:user?.date_of_birth
        ? new Date(user.user_metadata.date_of_birth)
        : undefined,
    },
  });

  // Profile image state
  // const [image, setImage] = React.useState(
  //  user?.avatar_url || DEFAULT_AVATAR_URL
  // );

  // const { updateAvatar, loading, error } = useAvatarUpdate({
  //   bucketName: "avatars",
  //   tableName: "profiles",
  //   userId: user?.id || "",
  // });

  // Handle form submission
  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error saving profile:", error);
    }
  };

  useIsomorphicLayoutEffect(() => {
    navigation.setOptions({
      headerShown: true,
      title: "Edit Profile",
    });
  }, [navigation]);

  return (
    <ScrollView className="flex-1 bg-blue-50 dark:bg-gray-900">
      <View className="p-6">
        {/* Profile Image */}
        {/* <View className="items-center mb-8">
          <Pressable disabled={loading} onPress={updateAvatar} className="relative">
            <Image
              source={{ uri: image }}
              style={{ width: 120, height: 120, borderRadius: 60 }}
              contentFit="cover"
            />
            <View className="absolute bottom-0 right-0 bg-blue-500 p-3 rounded-full shadow-lg">
             {loading ? (<ActivityIndicator color="white" />) : (<Ionicons name="camera" size={22} color="white" />)}
            </View>
          </Pressable>
          <Text className="text-sm text-gray-500 mt-4">
            Tap to change profile picture
          </Text>
        </View> */}

        {/* Form */}
        <View className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-gray-300">
          <Controller
            control={control}
            name="first_name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ThemedTextInput
                label="First Name"
                value={value}
                onChangeText={onChange}
                placeholder="Enter your first name"
              />
            )}
          />
          <Controller
            control={control}
            name="last_name"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ThemedTextInput
                label="Last Name"
                value={value}
                onChangeText={onChange}
                placeholder="Enter your last name"
              />
            )}
          />

          <Controller
            control={control}
            name="username"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ThemedTextInput
                label="Username"
                value={value}
                onChangeText={onChange}
                placeholder="Choose a username"
              />
            )}
          />
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <ThemedTextInput
                label="Email"
                value={value}
                onChangeText={onChange}
                editable={false}
              />
            )}
          />
          <DatePickerInput
            label="Date of Birth (Optional)"
            name="date_of_birth"
            control={control}
          />
        </View>

        {/* Save Button */}
        <ThemedButton
          label={isSubmitting ? "Saving..." : "Save Changes"}
          onPress={handleSubmit(onSubmit)}
          disabled={isSubmitting}
        />
      </View>
    </ScrollView>
  );
};

export default EditProfilePage;
