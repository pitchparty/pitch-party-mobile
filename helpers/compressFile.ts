import * as DocumentPicker from "expo-document-picker";
import * as ImageManipulator from "expo-image-manipulator";

import { DocumentFile, DocumentKey } from "@/features/create-account/store/managerOnboardingStore";


interface CompressFileProps {
    asset: DocumentPicker.DocumentPickerAsset;
    setIsCompressingDocument: (value: React.SetStateAction<string | null>) => void;
    key: DocumentKey
}

export const compressFile = async ({ asset, setIsCompressingDocument, key }: CompressFileProps): Promise<DocumentFile> => {
    const isImage = asset.mimeType?.startsWith("image");
    let fileUri = asset.uri;
    let size = asset.size ?? 0;
    setIsCompressingDocument(asset.uri);
    if (isImage) {
      const compressed = await ImageManipulator.manipulateAsync(
        asset.uri,
        [{ resize: { width: 1000 } }],
        { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG }
      );
      fileUri = compressed.uri;
      const response = await fetch(compressed.uri);
      const blob = await response.blob();
      size = blob.size;
    }

    return {
      uri: fileUri,
      name: asset.name ?? "Unnamed Document",
      type: asset.mimeType ?? "application/octet-stream",
      size,
      key
    };
  };