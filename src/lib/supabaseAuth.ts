
import { supabase } from './supabase';

// Auth helpers with correct Supabase V2 API calls
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user: data.user, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { session: data.session, user: data.user, error };
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { user: data.session?.user || null, error };
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

export const onAuthStateChange = (callback: (event: string, session: any) => void) => {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    callback(event, session);
  });
  return data.subscription;
};

// Export Supabase types
export type Session = {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  expires_at?: number;
  token_type: string;
  user: User;
};

export type User = {
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
};

export type UserIdentity = {
  id: string;
  user_id: string;
  identity_data: {
    [key: string]: any;
  };
  provider: string;
  created_at?: string;
  last_sign_in_at?: string;
  updated_at?: string;
};
