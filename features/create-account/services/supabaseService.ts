import { toast } from 'sonner-native';

import { supabase } from '../../../lib/supabase';

export interface ShopData {
  id?: string;
  name: string;
  address: string;
  description: string;
  longitude: number;
  latitude: number;
  amenities: string[];
  capacity: string;
  pricing: string;
  redemption_option: 'redeemable' | 'non-redeemable';
  contact_phone: string;
  contact_email: string;
  manager_id: string;
}

export interface ManagerData {
  id?: string;
  first_name: string;
  last_name: string;
  email_address: string;
  username: string;
  phone_number: string;
  role: 'manager';
}

export interface ShopDocuments {
  userId: string;
  venueId: string;
  documentType: string;
  cloudinaryUrl: string;
  isVerified?: boolean;
  verificationNotes?: string;
}

export interface ShopPhotosUpload {
  venueId: string;
  userId: string;
  documentType: string;
  cloudinaryUrl: string;
  isPrimary?: boolean;
}

interface ErrorResponse {
  code: string;
  message: string;
  details: string;
}

function isErrorResponse(error: unknown): error is ErrorResponse {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as any).message === 'string'
  );
}


/**
 * Registers a new manager using Supabase Auth
 */
export const registerManager = async (
  email: string,
  password: string,
  first_name: string,
  last_name: string,
  username: string,
  email_address: string,
  phone_number: string,
): Promise<string> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          role: 'manager',
          first_name,
          last_name,
          username,
          email_address,
          phone_number,
        },
      },
    });

    console.log('Register Manager:', JSON.stringify(data, null, 2));
    if (error) throw error;
    if (!data.user) throw new Error('User registration failed');

    return data.user.id;
  } catch (error) {
    console.error('Error registering manager:', error);
    if (isErrorResponse(error) && error.code === '23505') {
      toast.error("Phone number or email already exists");
      throw new Error('Phone number or email already exists');
    }
    throw error;
  }
};

/**
 * Creates a new shop in Supabase
 */
export const createShop = async (
  shopData: ShopData
): Promise<ShopData> => {
  try {
    const { data, error } = await supabase
      .from('venues')
      .insert(shopData)
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating shop:', error);
    throw error;
  }
};

/**
 * Saves shop documents to Supabase
 */
export const saveVenueDocuments = async (
  documents: ShopDocuments[]
): Promise<ShopDocuments[]> => {
  try {
    const payload = documents.map((doc) => ({
      venue_id: doc.venueId,
      document_type: doc.documentType,
      document_url: doc.cloudinaryUrl,
      is_verified: doc.isVerified ?? false,
      verified_by: doc.userId
    }));

    const { data, error } = await supabase
      .from('venue_documents')
      .insert(payload)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving shop documents:', error);
    throw error;
  }
};

/**
 * Saves shop photos to Supabase
 */
export const saveVenuePhotos = async (
  photoUrls: ShopPhotosUpload[]
): Promise<any> => {
  try {
    const photos = photoUrls.map((photo, index) => ({
      venue_id: photo?.venueId,
      photo_url: photo?.cloudinaryUrl,
      is_primary: index === 0,
      uploaded_by: photo?.userId
    }));

    const { data, error } = await supabase
      .from('venue_photos')
      .insert(photos)
      .select();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving shop photos:', error);
    throw error;
  }
};