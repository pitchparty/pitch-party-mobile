// types.ts

export interface FileObject {
    uri: string;
    name: string;
    type: string;
    size: number;
  }
  
  export interface RegisterUserInput {
    email: string;
    password: string;
    full_name: string;
    username: string;
    phone_number: string;
  }
  
  export interface ProfileInput {
    id: string;
    full_name: string;
    email: string;
    username: string;
    phone_number: string;
    role: 'user' | 'manager' | 'admin';
  }
  
  export interface ShopInput {
    name: string;
    description: string;
    address: string;
    longitude: number;
    latitude: number;
    amenities: string[];
    capacity: string;
    pricing: string;
    redemption_option: 'redeemable' | 'non-redeemable';
    contact_phone: string;
    contact_email: string;
    owner_id: string;
    is_approved?: boolean;
    is_active?: boolean;
  }
  
  export interface DocumentInput {
    user_id: string;
    document_type:
      | 'legal_document'
      | 'business_registration'
      | 'tax_compliance'
      | 'permit_license'
      | 'national_id'
      | 'health_safety';
    document_url: string;
    is_verified?: boolean;
    verification_notes?: string;
  }
  
  export interface ShopPhotoInput {
    shop_id: string;
    photo_url: string;
    is_primary?: boolean;
  }
  