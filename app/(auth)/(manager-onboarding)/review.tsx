import React from "react";
import { router } from "expo-router";
import * as Linking from "expo-linking";
import { View, Text, ScrollView, TouchableOpacity, Image } from "react-native";

import FormButtons from "@/features/create-account/components/FormButtons";
import SuccessModal from "@/features/create-account/components/SuccessModal";
import {
  useManagerOnboardingStore,
} from "@/features/create-account/store/managerOnboardingStore";
import { useReviewSubmit } from "@/features/create-account/hooks/useReviewSubmit";

const documentLabels = {
  business_registration: "Business Registration",
  legal_document: "Legal Documents",
  tax_compliance: "Tax Compliance",
  permit_license: "Permit License",
  national_id: "National ID",
  health_safety: "Health Safety",
} as const;

export default function Review() {
  const { personalData, shopData, documents, shopPhotos } =
    useManagerOnboardingStore();
  const { isSubmitting, onSubmit, isSuccessModalVisible, closeModal } =
    useReviewSubmit();

  const renderPdfBox = (label: string, uri: string) => (
    <TouchableOpacity
      key={label}
      onPress={() => Linking.openURL(uri)}
      className="w-1/3 p-1 items-center"
    >
      <View className="w-20 h-20 rounded bg-gray-200 items-center justify-center mb-1">
        <Text className="text-xs text-center text-gray-700" numberOfLines={2}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView className="flex-1 p-4 bg-blue-50 dark:bg-gray-900">
      {/* Personal Information */}
      <View className="bg-gray-50 rounded-lg p-4 mb-4 relative">
        <Text className="text-lg font-semibold mb-4">
          Personal Information.
        </Text>
        <InfoRow
          label="Name"
          value={`${personalData?.first_name ?? ""} ${
            personalData?.last_name ?? ""
          }`}
        />
        <InfoRow label="Username" value={personalData?.username ?? "-"} />
        <InfoRow label="Email" value={personalData?.email ?? "-"} />
        <InfoRow label="Phone" value={personalData?.phone_number ?? "-"} />
        <EditButton path="/(manager-onboarding)/step-one" />
      </View>

      {/* Shop Information */}
      <View className="bg-gray-50 rounded-lg p-4 mb-4 relative">
        <Text className="text-lg font-semibold mb-4">Shop Information.</Text>
        <InfoRow label="Shop Name" value={shopData?.name ?? "-"} />
        <InfoRow label="Address" value={shopData?.address ?? "-"} />
        <InfoRow label="Capacity" value={shopData?.capacity ?? "-"} />
        <InfoRow label="Pricing" value={shopData?.pricing ?? "-"} />
        <InfoRow label="Contact" value={shopData?.contact_phone ?? "-"} />
        <EditButton path="/(manager-onboarding)/step-two" />
      </View>

      {/* Documents */}
      <View className="bg-gray-50 rounded-lg p-4 mb-4 relative">
        <Text className="text-lg font-semibold mb-4">Documents</Text>
        <View className="flex-row flex-wrap mb-2">
          {shopPhotos?.[0] && (
            <View className="w-1/3 p-1 items-center">
              <View>
                <Image
                  source={{ uri: shopPhotos[0].uri }}
                  className="w-20 h-20 rounded mb-1"
                />
                <Text className="absolute top-1 right-1 bg-black/50 text-white px-1 rounded text-xs">
                  {shopPhotos.length}
                </Text>
              </View>
              <Text className="text-xs text-center text-gray-600">
                Shop Photo
              </Text>
            </View>
          )}
          {Object.entries(documentLabels).map(([key, label]) => {
            const doc = documents.find((d) => d.key === key);
            return doc ? renderPdfBox(label, doc.uri) : null;
          })}
        </View>
        <EditButton path="/(manager-onboarding)/step-three" />
      </View>

      <FormButtons
        onPrevious={() => router.back()}
        onNext={onSubmit}
        isValid={true}
        isSubmitting={isSubmitting}
      />
      <SuccessModal
        isVisible={isSuccessModalVisible}
        onClose={closeModal}
        onConfirm={closeModal}
      />
    </ScrollView>
  );
}

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View className="flex-row mb-2">
    <Text className="w-[100px] font-medium text-gray-600">{label}::</Text>
    <Text className="flex-1 text-gray-800">{value}</Text>
  </View>
);

const EditButton = ({ path }: { path: string }) => (
  <TouchableOpacity
    className="absolute top-4 right-4 bg-gray-200 px-3 py-1.5 rounded"
    // @ts-ignore
    onPress={() => router.push(path)}
  >
    <Text className="text-gray-600 font-medium">Edit</Text>
  </TouchableOpacity>
);
