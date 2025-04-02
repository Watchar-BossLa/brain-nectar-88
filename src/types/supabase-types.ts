
// This file contains types for Supabase that match the API version we're using

export interface Session {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
}

export interface User {
  id: string;
  app_metadata: {
    provider?: string;
    providers?: string[];
    [key: string]: any;
  };
  user_metadata: {
    avatar_url?: string;
    email?: string;
    email_verified?: boolean;
    full_name?: string;
    iss?: string;
    name?: string;
    preferred_username?: string;
    provider_id?: string;
    sub?: string;
    [key: string]: any;
  };
  aud: string;
  confirmation_sent_at?: string;
  confirmed_at?: string;
  created_at: string;
  email?: string;
  email_confirmed_at?: string;
  identities?: UserIdentity[];
  last_sign_in_at?: string;
  phone?: string;
  role?: string;
  updated_at?: string;
}

export interface UserIdentity {
  id: string;
  user_id: string;
  identity_data: {
    [key: string]: any;
  };
  provider: string;
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
}
