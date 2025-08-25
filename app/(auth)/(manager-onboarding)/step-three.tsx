import React from "react";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Text,
} from "react-native";

import FormButtons from "@/features/create-account/components/FormButtons";
import DocumentItem from "@/features/create-account/components/DocumentItem";
import { useDocumentPicker } from "@/features/create-account/hooks/useDocumentPicker";
import { useManagerOnboardingStore } from "@/features/create-account/store/managerOnboardingStore";

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

export default function StepThree() {
  const {
    documents,
    shopPhotos,
    pickDocument,
    removeDocument,
    isSubmitting,
    isValid,
    onSubmit: handleSubmit,
    isCompressingDocument,
  } = useDocumentPicker(useManagerOnboardingStore);


  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-blue-50 dark:bg-gray-900"
    >
      <ScrollView
        className="flex-1 px-5 pt-8"
        contentContainerClassName="pb-12"
        showsVerticalScrollIndicator={false}
      >
        {(Object.keys(documentLabels) as DocumentKey[]).map((key) => {
          const doc = documents.find((d) => d.key === key); // each doc has its key stored in uri
          return (
            <DocumentItem
              key={key}
              title={documentLabels[key].title}
              description={documentLabels[key].description}
              documents={doc ? [doc] : []}
              onPickDocument={() => pickDocument(key)}
              onRemoveDocument={() => doc && removeDocument(key, key)}
              isLoading={isCompressingDocument === key}
              documentKey={key}
              isCompressingDocument={isCompressingDocument}
              error={null}
            />
          );
        })}

        <View className="mt-6">
          <Text className="text-lg font-semibold mb-2">Shop Photos</Text>
          <DocumentItem
            title="Shop Photos"
            description="Upload clear photos of your shop (max 5)"
            documents={shopPhotos}
            onPickDocument={() => pickDocument("shopPhotos")}
            onRemoveDocument={(index) =>
              removeDocument("shopPhotos", shopPhotos[index].uri)
            }
            multiple
            isLoading={isCompressingDocument === "shopPhotos"}
            documentKey="shopPhotos"
            isCompressingDocument={isCompressingDocument}
            error={null}
          />
        </View>
      </ScrollView>

      <FormButtons
        onPrevious={() => router.back()}
        onNext={handleSubmit}
        isValid={isValid}
        isSubmitting={isSubmitting}
      />
    </KeyboardAvoidingView>
  );
}
