// src/hooks/useAvatarUpdate.ts
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import ImageManipulator, {  SaveFormat } from "expo-image-manipulator";

import { supabase } from "@/lib/supabase"; // Import your Supabase client

interface UseAvatarUpdateOptions {
  bucketName: string; // Name of the Supabase storage bucket
  tableName: string; // Name of the table to update (e.g., 'profiles')
  userId: string; // ID of the user whose avatar is being updated
}

export const useAvatarUpdate = ({ bucketName, tableName, userId }: UseAvatarUpdateOptions) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Select an image from the device.
   */
  const selectImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [1, 1], // Square aspect ratio
        quality: 0.8, // Initial quality reduction
      });

      if (!result.canceled && result.assets?.[0]?.uri) {
        return result.assets[0].uri;
      }
      return null;
    } catch (err) {
      setError("Failed to select image.");
      console.error(err);
      return null;
    }
  };

  /**
   * Compress and resize the selected image.
   */
  const compressImage = async (imageUri: string) => {
    try {
      const manipResult = await ImageManipulator.manipulateAsync(
        imageUri,
        [
          { resize: { width: 300 } }, // Resize to a maximum width of 300px (height is auto-calculated)
        ],
        {
          compress: 0.6, // Compress the image to 60% quality
          format: SaveFormat.JPEG, // Save as JPEG for better compression
        }
      );
      return manipResult.uri;
    } catch (err) {
      setError("Failed to compress image.");
      console.error(err);
      return null;
    }
  };

  /**
   * Upload the compressed image to Supabase Storage.
   */
  const uploadImageToSupabase = async (imageUri: string) => {
    try {
      const filePath = `${userId}/avatar.jpg`; // Unique path for the user's avatar
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, imageUri, {
          cacheControl: "3600",
          upsert: true, // Overwrite existing file
        });

      if (error) {
        setError("Failed to upload image to storage.");
        console.error(error);
        return null;
      }

      // Get the public URL of the uploaded image
      const publicURL = supabase.storage.from(bucketName).getPublicUrl(filePath);
      return publicURL.data.publicUrl;
    } catch (err) {
      setError("Failed to upload image to storage.");
      console.error(err);
      return null;
    }
  };

  /**
   * Update the `avatar_url` field in the database.
   */
  const updateAvatarUrlInDatabase = async (avatarUrl: string) => {
    try {
      const { error } = await supabase
        .from(tableName)
        .update({ avatar_url: avatarUrl })
        .eq("id", userId);

      if (error) {
        setError("Failed to update avatar URL in database.");
        console.error(error);
        return false;
      }
      return true;
    } catch (err) {
      setError("Failed to update avatar URL in database.");
      console.error(err);
      return false;
    }
  };

  /**
   * Main function to handle the entire process.
   */
  const updateAvatar = async () => {
    setLoading(true);
    setError(null);

    try {
      // Step 1: Select image
      const selectedImageUri = await selectImage();
      if (!selectedImageUri) {
        setLoading(false);
        return;
      }

      // Step 2: Compress and resize image
      const compressedImageUri = await compressImage(selectedImageUri);
      if (!compressedImageUri) {
        setLoading(false);
        return;
      }

      // Step 3: Upload image to Supabase Storage
      const avatarUrl = await uploadImageToSupabase(compressedImageUri);
      if (!avatarUrl) {
        setLoading(false);
        return;
      }

      // Step 4: Update `avatar_url` in the database
      const success = await updateAvatarUrlInDatabase(avatarUrl);
      if (!success) {
        setLoading(false);
        return;
      }

      setLoading(false);
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
      setLoading(false);
    }
  };

  return { updateAvatar, loading, error };
};