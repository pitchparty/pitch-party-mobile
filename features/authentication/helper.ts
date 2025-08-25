import { User } from "@supabase/supabase-js";

const sample_manager_user: User = {
  id: "some-uuid",
  aud: "authenticated",
  role: "manager",
  email: "user@example.com",
  phone: "",
  created_at: "2025-02-26T12:00:00Z",
  app_metadata: {
    provider: "email",
    providers: ["email"],
  },
  user_metadata: {
    full_name: "John Doe",
    phone_number: "+1234567890",
    role: "manager",
  },
  identities: [
    {
      identity_id: "some-uuid",
      id: "some-uuid",
      user_id: "some-uuid",
      identity_data: {
        email: "user@example.com",
      },
      provider: "email",
      last_sign_in_at: "2025-02-26T12:00:00Z",
      created_at: "2025-02-26T12:00:00Z",
      updated_at: "2025-02-26T12:00:00Z",
    },
  ],
};

const sample_user: User = {
  id: "user-uuid",
  aud: "authenticated",
  role: "user",
  email: "user@example.com",
  phone: "",
  created_at: "2025-02-26T12:05:00Z",
  app_metadata: {
    provider: "email",
    providers: ["email"],
  },
  user_metadata: {
    full_name: "Alice Johnson",
    phone_number: "+1234567890",
    role: "user",
  },
  identities: [
    {
      identity_id: "some-uuid",
      id: "user-uuid",
      user_id: "user-uuid",
      identity_data: {
        email: "user@example.com",
      },
      provider: "email",
      last_sign_in_at: "2025-02-26T12:05:00Z",
      created_at: "2025-02-26T12:05:00Z",
      updated_at: "2025-02-26T12:05:00Z",
    },
  ],
};

const sample_admin_user: User = {
  id: "admin-uuid",
  aud: "authenticated",
  role: "admin",
  email: "admin@example.com",
  phone: "",
  created_at: "2025-02-26T12:10:00Z",
  app_metadata: {
    provider: "email",
    providers: ["email"],
  },
  user_metadata: {
    full_name: "Robert Smith",
    phone_number: "+9876543210",
    role: "admin",
  },
  identities: [
    {
      identity_id: "some-uuid",
      id: "admin-uuid",
      user_id: "admin-uuid",
      identity_data: {
        email: "admin@example.com",
      },
      provider: "email",
      last_sign_in_at: "2025-02-26T12:10:00Z",
      created_at: "2025-02-26T12:10:00Z",
      updated_at: "2025-02-26T12:10:00Z",
    },
  ],
};

export { sample_manager_user, sample_user, sample_admin_user };