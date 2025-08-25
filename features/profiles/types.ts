export enum UserRole {
    USER = 'user',
    ADMIN = 'admin',
    MANAGER = 'manager'
  }
  
  export interface UserAddress {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  }
  
  export interface SocialLinks {
    twitter?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
  }
  
  export interface NotificationPreferences {
    email: boolean;
    sms: boolean;
    push: boolean;
  }
  
  export interface Profile {
    id: string;
    username?: string;
    first_name?: string;
    last_name?: string;
    avatar_url?: string;
    website?: string;
    preferred_team?: string;
    phone_number?: string;
    date_of_birth?: string;
    bio?: string;
    role: UserRole;
    address?: UserAddress;
    notification_prefs?: NotificationPreferences;
    social_links?: SocialLinks;
    created_at?: string;
    updated_at?: string;
    last_login?: string;
    last_activity?: string;
    is_active: boolean;
  }