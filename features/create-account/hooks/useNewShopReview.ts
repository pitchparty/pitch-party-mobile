import { useState } from "react";
import { router } from "expo-router";
import { uploadToCloudinary } from "../../../lib/cloudinary/cloudinaryService";
import { createShop, saveVenueDocuments, saveVenuePhotos } from "../../create-account/services/supabaseService";
import { useAuthStore } from "@/features/authentication/store";
import { useNewShopStore } from "../store/useNewShopStore";


export const useNewShopReviewSubmit = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessModalVisible, setIsSuccessModalVisible] = useState(false);
  const { user } = useAuthStore();
  const managerId = user?.id;
  const {
    progress,
    setProgress,
    resetProgress,
    shopData,
    documents,
    shopPhotos,
    resetNewShop
  } = useNewShopStore();

  const onSubmit = async () => {
    if (!shopData || !managerId) {
      console.error("Missing shop data or manager ID");
      return;
    }
  
    setIsSubmitting(true);
    let shopId = progress?.shopId;
  
    try {
      // STEP 3: Create Shop
      if (!shopId) {
        const shop = await createShop({
          name: shopData.name ?? "",
          description: shopData.description ?? "",
          address: shopData.address ?? "",
          longitude: shopData.longitude ?? 0,
          latitude: shopData.latitude ?? 0,
          amenities: shopData.amenities ?? [],
          capacity: shopData.capacity ?? "",
          pricing: shopData.pricing ?? "",
          redemption_option: shopData.redemption_option ?? "non-redeemable",
          contact_phone: shopData.contact_phone ?? "",
          contact_email: shopData.contact_email ?? "",
          manager_id: managerId,
        });
  
        shopId = shop?.id!;
        setProgress({
          shopId,
          documentsUploaded: false,
          photosUploaded: false,
        });
      }
  
      // STEP 4: Upload & Save Documents
      if (!progress?.documentsUploaded && documents.length > 0) {
        const uploadedDocs = await Promise.all(
          documents.map(async (doc) => {
            const result = await uploadToCloudinary(doc.uri);
            return {
              venueId: shopId!,
              userId: managerId,
              documentType: doc.key,
              cloudinaryUrl: result.secure_url,
              isVerified: false,
            };
          })
        );
  
        await saveVenueDocuments(uploadedDocs);
        setProgress({
          shopId,
          documentsUploaded: true,
          photosUploaded: false,
        });
      }
  
      // STEP 5: Upload & Save Shop Photos
      if (!progress?.photosUploaded && shopPhotos.length > 0) {
        const uploadedPhotos = await Promise.all(
          shopPhotos.map(async (photo) => {
            const result = await uploadToCloudinary(photo.uri, "shop_photos");
            return {
              venueId: shopId!,
              userId: managerId,
              documentType: "shop_photo",
              cloudinaryUrl: result.secure_url,
              isPrimary: false,
            };
          })
        );
  
        await saveVenuePhotos(uploadedPhotos);
        setProgress({
          shopId,
          documentsUploaded: true,
          photosUploaded: true,
        });
      }
  
      setIsSuccessModalVisible(true);
      resetProgress();
      resetNewShop();
    } catch (err) {
      console.error("Shop submission failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const closeModal = () => {
    setIsSuccessModalVisible(false);
    router.navigate("/(manager)/manager-account");
  };

  return { isSubmitting, onSubmit, isSuccessModalVisible, closeModal };
};
