
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { 
  signUp as authSignUp, 
  signInWithPassword, 
  signOut as authSignOut,
  getSession as authGetSession,
  getCurrentUser as authGetUser
} from './supabaseAuth';

// Auth helpers
export const signUp = async (email: string, password: string) => {
  const { data, error } = await authSignUp(email, password);
  return { user: data.user as User | null, error };
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await signInWithPassword(email, password);
  return { session: data.session, user: data.user as User | null, error };
};

export const signOut = async () => {
  const { error } = await authSignOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data, error } = await authGetUser();
  return { user: data.user as User | null || null, error };
};

export const getCurrentSession = async () => {
  const { data, error } = await authGetSession();
  return { session: data.session, error };
};

export { supabase };
