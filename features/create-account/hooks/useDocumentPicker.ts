import { useState } from "react";
import { router } from "expo-router";
import * as DocumentPicker from "expo-document-picker";

import { DocumentKey, DocumentFile } from "../store/managerOnboardingStore";
import { compressFile } from "@/helpers";

const DOCUMENT_KEYS: DocumentKey[] = [
  "legal_document",
  "business_registration",
  "tax_compliance",
  "permit_license",
  "national_id",
  "health_safety",
];

interface UseDocumentStore {
  shopPhotos: DocumentFile[];
  documents: DocumentFile[];
  addShopPhoto: (photos: DocumentFile[]) => void;
  addDocument: (doc: DocumentFile) => void;
  removeShopPhoto: (uri: string) => void;
  removeDocuments: (key: DocumentKey, uri: string) => void;
}

export const useDocumentPicker = (
  useDocumentStore: () => UseDocumentStore,
  nextRoute: string = "/(auth)/(manager-onboarding)/review"
) => {
  const {
    shopPhotos,
    documents,
    addShopPhoto,
    addDocument,
    removeShopPhoto,
    removeDocuments,
  } = useDocumentStore();

  const [isCompressingDocument, setIsCompressingDocument] = useState<string | null>(null);

  const pickDocument = async (key: DocumentKey | "shopPhotos") => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["application/pdf", "image/*"],
        copyToCacheDirectory: true,
        multiple: key === "shopPhotos",
      });

      if (result.canceled || !result.assets?.length) return;

      const files = await Promise.all(
        result.assets.map((asset) =>
          compressFile({ asset, setIsCompressingDocument, key })
        )
      );

      if (key === "shopPhotos") {
        if (shopPhotos.length + files.length <= 5) {
          addShopPhoto(files);
        } else {
          alert("You can upload a maximum of 5 photos.");
        }
      } else {
        const docWithKey: DocumentFile = { ...files[0], key };
        addDocument(docWithKey);
      }
    } catch (error) {
      console.error(`Error picking ${key}:`, error);
    } finally {
      setIsCompressingDocument(null);
    }
  };

  const removeDocument = (key: DocumentKey | "shopPhotos", uri: string) => {
    if (key === "shopPhotos") {
      removeShopPhoto(uri);
    } else {
      removeDocuments(key, uri);
    }
  };

  const isValid =
    DOCUMENT_KEYS.every((key) => documents.some((doc) => doc.key === key)) &&
    shopPhotos.length > 0;

  const onSubmit = async () => {
    if (!isValid) return;

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      // @ts-ignore
      router.push(nextRoute);
    } catch (error) {
      console.error("Error submitting documents:", error);
    }
  };

  return {
    documents,
    shopPhotos,
    pickDocument,
    removeDocument,
    isCompressingDocument,
    isSubmitting: false,
    isValid,
    onSubmit,
  };
};
