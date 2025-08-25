import { create } from 'zustand';
import { FileInfo } from './fileUtilityService';

interface Document {
    document_type: string;
    asset_url: string[];
    mimeType: string;
  }
  
  interface DocumentStore {
    documents: Document[];
    addDocuments: (title: string, files: FileInfo[]) => void;
    reset: () => void;
  }
  
  const generateSlug = (title: string) =>
    title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  
  export const useDocumentStore = create<DocumentStore>((set) => ({
    documents: [],
    addDocuments: (title, files) => {
      set((state) => {
        const slug = generateSlug(title);
        const assetUrls = files.map((file) => file.uri);
        const mimeType = files[0]?.mimeType || 'application/octet-stream'; // Fallback MIME type
  
        // Find existing document by slug (consistent identifier)
        const existingIndex = state.documents.findIndex((doc) => doc.document_type === slug);
  
        if (existingIndex !== -1) {
          // If it exists, append new URLs instead of replacing
          const updatedDocuments = [...state.documents];
          updatedDocuments[existingIndex] = {
            ...updatedDocuments[existingIndex],
            asset_url: [...updatedDocuments[existingIndex].asset_url, ...assetUrls],
            mimeType: mimeType, // Update MIME type if needed
          };
          return { documents: updatedDocuments };
        }
  
        // If it does not exist, add a new entry
        return {
          documents: [...state.documents, { document_type: slug, asset_url: assetUrls, mimeType }],
        };
      });
    },
    reset: () => set({ documents: [] }),
  }));