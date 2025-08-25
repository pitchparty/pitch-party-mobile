export type RegisterUserRole = "user" | "manager" | "admin";

export type UserRole = "user" | "manager" | "admin";

export interface signUpParams {
  email: string;
  password: string;
  username: string;
  phone_number: string;
  role: RegisterUserRole;
  first_name: string;
  last_name: string;
}

export interface UserProfile {
  id: string;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  email_address: string | null;
  avatar_url: string | null;
  website: string | null;
  preferred_team: string | null;
  phone_number: string | null;
  date_of_birth: string | null;
  bio: string | null;
  role: UserRole;
  address: Record<string, any> | null;
  notification_prefs: {
    sms: boolean;
    push: boolean;
    email: boolean;
  };
  social_links: Record<string, string>;
  created_at: string;
  updated_at: string;
  last_login: string | null;
  last_activity: string | null;
  is_active: boolean;
  progress: {
    venue_info: boolean;
    personal_info: boolean;
    photos_uploaded: boolean;
    documents_uploaded: boolean;
  };
}