import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { ShopFormData } from "../../create-account/validation/shopValidationScheme";


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

export interface NewShopProgress {
  shopId: string | null;
  documentsUploaded: boolean;
  photosUploaded: boolean;
}

interface NewShopState {
  managerId: string | null;
  setManagerId: (managerId: string) => void;

  shopData: Partial<ShopFormData>;
  updateShopData: (data: Partial<ShopFormData>) => void;
  setShopData: (data: ShopFormData) => void;

  documents: DocumentFile[];
  addDocument: (document: DocumentFile) => void;
  removeDocuments: (key: DocumentKey, documentUri: string) => void;
  clearDocuments: () => void;

  shopPhotos: DocumentFile[];
  addShopPhoto: (photo: DocumentFile[]) => void;
  removeShopPhoto: (photoUri: string) => void;
  clearShopPhotos: () => void;

  currentStep: number;
  setCurrentStep: (step: number) => void;

  progress: NewShopProgress | null;
  setProgress: (progress: NewShopProgress) => void;
  resetProgress: () => void;

  error: string | null;
  resetNewShop: () => void;
}

export const useNewShopStore = create<NewShopState>()(
  persist(
    (set) => ({
      managerId: null,
      setManagerId: (managerId) => set({ managerId }),

      shopData: {},
      updateShopData: (data) =>
        set((state) => ({
          shopData: {
            ...state.shopData,
            ...data,
          },
        })),
      setShopData: (data) => set({ shopData: data }),

      documents: [],
      addDocument: (document) =>
        set((state) => ({
          documents: [...state.documents, document],
        })),
      removeDocuments: (key, uri) =>
        set((state) => ({
          documents: state.documents.filter(
            (doc) => !(doc.key === key && doc.uri === uri)
          ),
        })),
      clearDocuments: () => set({ documents: [] }),

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

      currentStep: 1,
      setCurrentStep: (step) => set({ currentStep: step }),

      progress: null,
      setProgress: (progress) => set({ progress }),
      resetProgress: () => set({ progress: null }),

      error: null,
      resetNewShop: () =>
        set({
          currentStep: 1,
          shopData: {},
          documents: [],
          shopPhotos: [],
          progress: null,
          error: null,
        }),
    }),
    {
      name: "new-shop-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
