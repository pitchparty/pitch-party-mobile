import { useState } from "react";
import * as DocumentPicker from "expo-document-picker";

import { compressFile } from "@/helpers";
import { useAddVenueStore } from "../store/useAddVenueStore";
import { router } from "expo-router";

const REQUIRED_DOCUMENT_KEYS = [
  "legal_document",
  "business_registration",
  "tax_compliance",
  "permit_license",
  "national_id",
  "health_safety",
];

export const useAddVenueDocuments = () => {
  const [isCompressing, setIsCompressing] = useState<string | null>(null);

  const {
    documents,
    venuePhotos,
    addDocument,
    addVenuePhotos,
    removeDocument,
    removeVenuePhoto,
  } = useAddVenueStore();

  const pick = async (key: "shopPhotos" | string) => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
        multiple: key === "shopPhotos",
      });

      if (result.canceled || !result.assets?.length) return;

      const files = await Promise.all(
        result.assets.map((asset) =>
          compressFile({ asset, setIsCompressingDocument: setIsCompressing, key })
        )
      );

      if (key === "shopPhotos") {
        if (venuePhotos.length + files.length <= 5) {
          addVenuePhotos(files);
        } else {
          alert("You can upload a maximum of 5 photos.");
        }
      } else {
        addDocument({ ...files[0], key });
      }
    } catch (error) {
      console.error(`Error picking document for ${key}:`, error);
    } finally {
      setIsCompressing(null);
    }
  };

  const remove = (key: string, uri: string) => {
    if (key === "shopPhotos") {
      removeVenuePhoto(uri);
    } else {
      removeDocument(key, uri);
    }
  };

  const isValid =
    REQUIRED_DOCUMENT_KEYS.every((key) => documents.some((doc) => doc.key === key)) &&
    venuePhotos.length > 0;

  const onSubmit = async () => {
    if (!isValid) return;
    router.push("/venues/add/shop-review"); 
  };

  return {
    documents,
    venuePhotos,
    pick,
    remove,
    isCompressing,
    isValid,
    onSubmit,
  };
};
