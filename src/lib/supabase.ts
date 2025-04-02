
import { supabase } from '@/integrations/supabase/client';
import { AuthUser } from '@/context/auth/types';

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  return { user: data.user as AuthUser | null, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { session: data.session, user: data.user as AuthUser | null, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { user: data.session?.user as AuthUser | null || null, error };
};

export const getCurrentSession = async () => {
  const { data, error } = await supabase.auth.getSession();
  return { session: data.session, error };
};

export { supabase };
