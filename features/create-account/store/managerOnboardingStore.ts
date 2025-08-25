import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ShopFormData } from "../validation/shopValidationScheme";
import { personalFormData } from "../validation/personalValidationSchema";

export type DocumentKey =
  | "legal_document"
  | "business_registration"
  | "tax_compliance"
  | "permit_license"
  | "national_id"
  | "health_safety"
  | "shopPhotos";

export type DocumentFile = {
  uri: string;
  name: string;
  type: string;
  size: number;
  key: DocumentKey;
};

export interface OnboardProgress {
  managerId: string | null;
  shopId: string | null;
  documentsUploaded: boolean;
  photosUploaded: boolean;
}

interface ManagerOnboardingState {
  // Personal
  personalData: personalFormData | null;
  setPersonalData: (data: personalFormData) => void;

  // Shop
  shopData: Partial<ShopFormData>;
  updateShopData: (data: Partial<ShopFormData>) => void;
  setShopData: (data: ShopFormData) => void;

  // Documents
  documents: DocumentFile[];
  addDocument: (document: DocumentFile) => void;
  removeDocuments: (key: DocumentKey, documentUri: string) => void;
  clearDocuments: () => void;

  // Shop Photos
  shopPhotos: DocumentFile[];
  addShopPhoto: (photo: DocumentFile[]) => void;
  removeShopPhoto: (photoUri: string) => void;
  clearShopPhotos: () => void;

  // Progress & Navigation
  currentStep: number;
  setCurrentStep: (step: number) => void;
  onboardingProgress: OnboardProgress | null;
  setOnboardingProgress: (progress: OnboardProgress) => void;

  // General
  error: string | null;
  resetOnboarding: () => void;
}

export const useManagerOnboardingStore = create<ManagerOnboardingState>()(
  persist(
    (set) => ({
      // --- Personal ---
      personalData: null,
      setPersonalData: (data) => set({ personalData: data }),

      // --- Shop ---
      shopData: {},
      updateShopData: (data) =>
        set((state) => ({
          shopData: {
            ...state.shopData,
            ...data,
          },
        })),
      setShopData: (data) => set({ shopData: data }),

      // --- Documents ---
      documents: [],
      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents, document],
        })),
      removeDocuments: (key: DocumentKey, documentUri: string) => {
        set((state) => ({
          documents: state.documents.filter(
            (doc) => !(doc.key === key && doc.uri === documentUri)
          ),
        }));
      },
      clearDocuments: () => set({ documents: [] }),

      // --- Shop Photos ---
      shopPhotos: [],
      addShopPhoto: (photos) =>
        set((state) => ({
          shopPhotos: [...state.shopPhotos, ...photos],
        })),
      removeShopPhoto: (uri) =>
        set((state) => ({
          shopPhotos: state.shopPhotos.filter((photo) => photo.uri !== uri),
        })),
      clearShopPhotos: () => set({ shopPhotos: [] }),

      // --- Progress & Step ---
      currentStep: 1,
      setCurrentStep: (step) => set({ currentStep: step }),
      onboardingProgress: null,
      setOnboardingProgress: (progress) =>
        set({ onboardingProgress: progress }),

      // --- General ---
      error: null,
      resetOnboarding: () =>
        set({
          currentStep: 1,
          personalData: null,
          shopData: {},
          documents: [],
          shopPhotos: [],
          onboardingProgress: null,
          error: null,
        }),
    }),
    {
      name: "manager-onboarding-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
