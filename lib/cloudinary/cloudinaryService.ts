import * as FileSystem from "expo-file-system";
import { DocumentKey } from "../../features/create-account/store/managerOnboardingStore";

export interface Document {
  uri: string;
  name: string;
  type: string;
  size: number;
  key: DocumentKey;
}

export interface CloudinaryUploadResult {
  secure_url: string;
  public_id: string;
  format: string;
  resource_type: string;
  [key: string]: any;
}

const CLOUDINARY_UPLOAD_PRESET = "venue_documents";
const CLOUDINARY_CLOUD_NAME =
  process.env.EXPO_PUBLIC_CLOUDINARY_CLOUD_NAME || "";
const CLOUDINARY_URL = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/upload`;

/**
 * Uploads a single file to Cloudinary using expo-file-system
 */
export const uploadToCloudinary = async (
  fileUri: string,
  folder: string = "vendor_documents"
): Promise<CloudinaryUploadResult> => {
  if (!fileUri.startsWith("file://")) {
    throw new Error("Only local files can be uploaded");
  }

  const uploadUrl = `${CLOUDINARY_URL}?upload_preset=${CLOUDINARY_UPLOAD_PRESET}`;

  const result = await FileSystem.uploadAsync(uploadUrl, fileUri, {
    fieldName: "file",
    httpMethod: "POST",
    uploadType: FileSystem.FileSystemUploadType.MULTIPART,
    parameters: {
      folder,
    },
  });

  if (result.status !== 200) {
    throw new Error(`Cloudinary upload failed: ${result.body}`);
  }

  return JSON.parse(result.body);
};
