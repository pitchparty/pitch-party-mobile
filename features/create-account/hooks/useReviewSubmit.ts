import { useState } from "react";
import { router } from "expo-router";
import { toast } from "sonner-native";

import {
  createShop,
  saveVenuePhotos,
  registerManager,
  saveVenueDocuments,
} from "../services/supabaseService";
import { uploadToCloudinary } from "../../../lib/cloudinary/cloudinaryService";
import { useManagerOnboardingStore } from "../store/managerOnboardingStore";
import { updateProgress } from "../helper";

export const useReviewSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);

  const {
    personalData,
    shopData,
    documents,
    shopPhotos,
    onboardingProgress,
    setOnboardingProgress,
    resetOnboarding,
  } = useManagerOnboardingStore();

  const onSubmit = async () => {
    if (!personalData || !shopData) {
      toast.error("Phone number or email already exists");
      console.error("Missing personal or shop data");
      return;
    }

    setIsSubmitting(true);
    let { managerId, shopId } = onboardingProgress || {};

    try {
      const { first_name, last_name, email, phone_number, username, password } =
        personalData;

      const {
        name,
        description,
        address,
        latitude,
        longitude,
        amenities,
        capacity,
        pricing,
        redemption_option,
        contact_phone,
        contact_email,
      } = shopData;

      // STEP 1: Register manager
      if (!managerId) {
        await registerManager(
          email,
          password as string,
          first_name,
          last_name,
          username,
          email,
          phone_number
        )
          .then(async (res) => {
            console.log("Manager registered:", res);
            managerId = res;
            setOnboardingProgress({
              managerId,
              shopId: null,
              documentsUploaded: false,
              photosUploaded: false,
            });
            await updateProgress(managerId!, "personal_info", true);
          })
          .catch(async (err) => {
            console.error("Manager registration failed:", err);
            await updateProgress(managerId!, "personal_info", false);
          });
      }

      // STEP 2: Create shop
      if (!shopId) {
        await createShop({
          name: name ?? "",
          description: description ?? "",
          address: address ?? "",
          longitude: longitude ?? 0,
          latitude: latitude ?? 0,
          amenities: amenities ?? [],
          capacity: capacity ?? "",
          pricing: pricing ?? "",
          redemption_option: redemption_option ?? "non-redeemable",
          contact_phone: contact_phone ?? "",
          contact_email: contact_email ?? "",
          manager_id: managerId!,
        })
          .then(async (res) => {
            console.log("Shop created:", res);
            shopId = res.id;

            setOnboardingProgress({
              managerId: managerId!,
              shopId: shopId!,
              documentsUploaded: false,
              photosUploaded: false,
            });
            await updateProgress(managerId!, "venue_info", true);
          })
          .catch(async (err) => {
            console.error("Shop creation failed:", err);
            await updateProgress(managerId!, "venue_info", false);
          });
      }

      // STEP 3: Upload & Save Documents
      if (!onboardingProgress?.documentsUploaded && documents.length > 0) {
        try {
          const uploadedDocs = await Promise.all(
            documents.map(async (doc) => {
              const result = await uploadToCloudinary(doc.uri);
              return {
                venueId: shopId!,
                userId: managerId!,
                documentType: doc.key,
                cloudinaryUrl: result.secure_url,
                isVerified: false,
              };
            })
          );

          await saveVenueDocuments(uploadedDocs);

          setOnboardingProgress({
            managerId: managerId!,
            shopId: shopId!,
            documentsUploaded: true,
            photosUploaded: false,
          });

          await updateProgress(managerId!, "documents_uploaded", true);
        } catch (error) {
          console.error("Document step failed:", error);
          setOnboardingProgress({
            managerId: managerId!,
            shopId: shopId!,
            documentsUploaded: false,
            photosUploaded: false,
          });
          await updateProgress(managerId!, "documents_uploaded", false);
        }
      }

      // STEP 4: Upload & Save Shop Photos
      if (!onboardingProgress?.photosUploaded && shopPhotos.length > 0) {
        try {
          const uploadedPhotos = await Promise.all(
            shopPhotos.map(async (photo) => {
              const result = await uploadToCloudinary(photo.uri, "shop_photos");
              return {
                venueId: shopId!,
                userId: managerId!,
                documentType: "shop_photo",
                cloudinaryUrl: result.secure_url,
                isPrimary: false,
              };
            })
          );

          await saveVenuePhotos(uploadedPhotos);
          setOnboardingProgress({
            managerId: managerId!,
            shopId: shopId!,
            documentsUploaded: true,
            photosUploaded: true,
          });
          await updateProgress(managerId!, "photos_uploaded", true);
          setIsSuccessModalVisible(true);
          resetOnboarding();
        } catch (error) {
          console.error("Photo step failed:", error);
          setOnboardingProgress({
            managerId: managerId!,
            shopId: shopId!,
            documentsUploaded: true,
            photosUploaded: false,
          });
          await updateProgress(managerId!, "photos_uploaded", false);
        }
      }
    } catch (err) {
      console.error("Submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsSuccessModalVisible(false);
    router.replace("/(auth)/onboarding");
  };

  return { isSubmitting, onSubmit, isSuccessModalVisible, closeModal };
};
