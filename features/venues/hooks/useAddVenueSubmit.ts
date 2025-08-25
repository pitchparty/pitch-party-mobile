// hooks/useVenueFinalSubmit.ts
import { useState } from "react";
import { router } from "expo-router";

import { createVenue } from "../api";
import { useAddVenueStore } from "../store/useAddVenueStore";

import { useAuthStore } from "@/features/authentication/store";
import { uploadToCloudinary } from "@/lib/cloudinary/cloudinaryService";
import { saveVenueDocuments, saveVenuePhotos } from "@/features/create-account/services/supabaseService";
import { useQueryClient } from "@tanstack/react-query";

export const useAddVenueSubmit = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const { venueData, documents, venuePhotos, reset } = useAddVenueStore();
  const { user } = useAuthStore();
  const managerId = user?.id;

  const submit = async () => {
    if (!venueData || !managerId) return;

    setIsSubmitting(true);

    try {
        const venue = await createVenue({
          ...venueData,
          manager_id: managerId,
        });

      const venueId = venue.id;
      if (documents.length > 0) {
        const uploadedDocs = await Promise.all(
          documents.map(async (doc) => {
            const res = await uploadToCloudinary(doc.uri);
            return {
              venueId: venueId!,
              userId: managerId,
              documentType: doc.key,
              cloudinaryUrl: res.secure_url,
              isVerified: false,
            };
          })
        );
        await saveVenueDocuments(uploadedDocs);
       
      }

      if (venuePhotos.length > 0) {
        const uploadedPhotos = await Promise.all(
          venuePhotos.map(async (photo) => {
            const res = await uploadToCloudinary(photo.uri, "venue_photos");
            return {
              venueId: venueId!,
              userId: managerId,
              documentType: "venue_photo",
              cloudinaryUrl: res.secure_url,
              isPrimary: false,
            };
          })
        );
        await saveVenuePhotos(uploadedPhotos);
      }

      await queryClient.invalidateQueries({ queryKey: ['managerVenues'] })

      setIsSuccessModalVisible(true);
      reset();
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsSuccessModalVisible(false);
    router.navigate("/(manager)/manager-account");
  };

  return { submit, isSubmitting, isSuccessModalVisible, closeModal };
};
