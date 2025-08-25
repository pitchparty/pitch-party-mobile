import React, { useCallback } from "react";
import { UseFormReturn } from "react-hook-form";
import { Text, View, ScrollView } from "react-native";

import { DocumentsData } from "@/features/venues/schema";
import { UploadDocumentButton, FileInfo } from "@/components/file-upload";
import { useDocumentStore } from "@/components/file-upload/useDocumentStore";

interface DocumentDetailsProps {
  form: UseFormReturn<DocumentsData>;
}

const DocumentDetails: React.FC<DocumentDetailsProps> = ({ form }) => {
  const { addDocuments } = useDocumentStore();

  const handleFileSelected = useCallback(
    (title: string, files: FileInfo[]) => {
      addDocuments(title, files);
      const updatedDocs = files.map((file) => ({
        asset_url: [file.uri],
        document_type: title.toLowerCase().replace(/\s+/g, "_"),
        mimeType: file.mimeType || "application/octet-stream",
      }));
      form.setValue("documents", updatedDocs, { shouldValidate: true });
    },
    [addDocuments, form]
  );

  const { errors } = form.formState;

  return (
    <ScrollView
      className="flex-1 bg-blue-50 dark:bg-gray-900 p-6"
      keyboardShouldPersistTaps="handled"
      contentContainerStyle={{ paddingBottom: 50 }}
    >
      {errors.documents && (
        <Text className="text-red-500 mb-4">
          {errors.documents.message || "Please upload all required documents"}
        </Text>
      )}
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Legal Documents
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-sm mt-1 mb-2">
          Require legal documents to verify the legitimacy of the venue:
        </Text>
        <UploadDocumentButton
          title="Upload Business Registration Certificate"
          description="Proof that the venue is registered as a legal entity (e.g., certificate of incorporation)."
          icon="cloud-upload-outline"
          onFileSelected={handleFileSelected}
          allowedTypes={["image/*", "application/pdf"]}
          maxFileSize={5 * 1024 * 1024}
        />
        <UploadDocumentButton
          title="Upload Tax Compliance Certificate"
          description="Proof that the venue is compliant with local tax regulations."
          icon="cloud-upload-outline"
          onFileSelected={handleFileSelected}
          allowedTypes={["image/*", "application/pdf"]}
          maxFileSize={5 * 1024 * 1024}
        />
        <UploadDocumentButton
          title="Upload Permit/License"
          description="A valid permit or license to operate as a sports or event venue (issued by local authorities)."
          icon="cloud-upload-outline"
          onFileSelected={handleFileSelected}
          allowedTypes={["image/*", "application/pdf"]}
          maxFileSize={5 * 1024 * 1024}
        />
      </View>
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Ownership Proof Documents{" "}
        </Text>
        <Text className="text-gray-500 text-sm mt-1 mb-2">
          Verify the ownership or management of the venue:
        </Text>
        <UploadDocumentButton
          title="Upload National ID/Passport"
          description="Copy of the owner/manager’s identification document."
          icon="cloud-upload-outline"
          onFileSelected={handleFileSelected}
          multiple={true}
          allowedTypes={["image/*", "application/pdf"]}
          maxFileSize={5 * 1024 * 1024}
        />
      </View>
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Safety and Compliance Certificates
        </Text>
        <Text className="text-gray-500 text-sm mt-1 mb-2">
          Ensure the venue complies with safety and regulatory requirements:
        </Text>
        <UploadDocumentButton
          title="Upload Health and Safety Certificate"
          description="Proof that the venue meets health and safety standards (e.g., sanitation, emergency exits)."
          icon="cloud-upload-outline"
          onFileSelected={handleFileSelected}
          allowedTypes={["image/*", "application/pdf"]}
          maxFileSize={5 * 1024 * 1024}
        />
      </View>
      <View className="mb-4">
        <Text className="text-lg font-bold text-gray-800 dark:text-gray-100">
          Photos and Videos{" "}
        </Text>
        <Text className="text-gray-500 text-sm mt-1 mb-2">
          Provide visual evidence of the venue:
        </Text>
        <UploadDocumentButton
          title="Upload High-Quality Photos"
          description="Images of the venue, including the playing area, amenities, and surroundings."
          icon="cloud-upload-outline"
          onFileSelected={handleFileSelected}
          multiple={true}
          allowedTypes={["image/*"]}
          maxFileSize={5 * 1024 * 1024}
        />
      </View>
    </ScrollView>
  );
};

export default DocumentDetails;
