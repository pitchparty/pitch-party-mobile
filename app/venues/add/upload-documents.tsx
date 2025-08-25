import React from "react";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
} from "react-native";

import DocumentItem from "@/features/create-account/components/DocumentItem";
import FormButtons from "@/features/create-account/components/FormButtons";
import { useDocumentPicker } from "@/features/create-account/hooks/useDocumentPicker";
import { useNewShopStore } from "@/features/create-account/store/useNewShopStore";
import { useAddVenueDocuments } from "@/features/venues/hooks/useAddVenueDocuments";



const documentLabels = {
  legal_document: {
    title: "Legal Document",
    description: "Upload any relevant legal documents",
  },
  business_registration: {
    title: "Business Registration",
    description: "Upload your business registration certificate",
  },
  tax_compliance: {
    title: "Tax Compliance",
    description: "Upload your business tax document",
  },
  permit_license: {
    title: "Business License",
    description: "Upload your business license or permit",
  },
  national_id: {
    title: "Identity Verification",
    description: "Upload a government-issued ID",
  },
  health_safety: {
    title: "Health & Safety",
    description: "Upload your health and safety certification",
  },
} as const;

type DocumentKey = keyof typeof documentLabels;

export default function UploadNewVenueDocuments() {

  const {
    documents,
    venuePhotos,
    pick,
    remove,
    isCompressing,
    isValid,
    onSubmit,
  } = useAddVenueDocuments();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1 px-5 pt-8"
        contentContainerClassName="pb-12"
        showsVerticalScrollIndicator={false}
      >
        {(Object.keys(documentLabels) as DocumentKey[]).map((key) => {
          const doc = documents.find((d) => d.key === key);
          return (
            <DocumentItem
              key={key}
              title={documentLabels[key].title}
              description={documentLabels[key].description}
              documents={doc ? [doc] : []}
              onPickDocument={() => pick(key)}
              onRemoveDocument={() => doc && remove(key, key)}
              isLoading={isCompressing === key}
              documentKey={key}
              isCompressingDocument={isCompressing}
              error={null}
            />
          );
        })}

        <View className="mt-6">
          <Text className="text-lg font-semibold mb-2">Shop Photos</Text>
          <DocumentItem
            title="Venue Photos"
            description="Upload clear photos of your venue (max 5)"
            documents={venuePhotos}
            onPickDocument={() => pick("shopPhotos")}
            onRemoveDocument={(index) =>
              remove("shopPhotos", documents[index].uri)
            }
            multiple
            isLoading={isCompressing === "shopPhotos"}
            documentKey="shopPhotos"
            isCompressingDocument={isCompressing}
            error={null}
          />
        </View>
      </ScrollView>

      <FormButtons
        onPrevious={() => router.back()}
        onNext={onSubmit}
        isValid={isValid}
        isSubmitting={false}
      />

    </KeyboardAvoidingView>
  );
}
