
import { supabase } from './supabase';
import { Provider } from '@supabase/supabase-js';

// This file provides a compatibility layer for the Supabase API
// to handle different versions of the API

export const signUp = async (email: string, password: string) => {
  try {
    // Try the new method first
    if (typeof supabase.auth.signUp === 'function') {
      return await supabase.auth.signUp({ email, password });
    }
    // Fall back to the typed method (TypeScript doesn't recognize it, but it might exist at runtime)
    return await (supabase.auth as any).signUp({ email, password });
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  try {
    // Try the new method first
    if (typeof supabase.auth.signInWithPassword === 'function') {
      return await supabase.auth.signInWithPassword({ email, password });
    }
    // Fall back to the typed method
    return await (supabase.auth as any).signIn({ email, password });
  } catch (error) {
    console.error('Error in signInWithPassword:', error);
    throw error;
  }
};

export const signInWithOAuth = async (provider: Provider, options?: any) => {
  try {
    // Try the new method first
    if (typeof supabase.auth.signInWithOAuth === 'function') {
      return await supabase.auth.signInWithOAuth({ provider, ...options });
    }
    // Fall back to the typed method
    return await (supabase.auth as any).signIn({ provider }, options);
  } catch (error) {
    console.error('Error in signInWithOAuth:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    // Try the new method first
    if (typeof supabase.auth.signOut === 'function') {
      return await supabase.auth.signOut();
    }
    // Fall back to the typed method
    return await (supabase.auth as any).signOut();
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    // Try the new method first
    if (typeof supabase.auth.getSession === 'function') {
      return await supabase.auth.getSession();
    }
    // Fall back to the typed method
    return await (supabase.auth as any).session();
  } catch (error) {
    console.error('Error in getSession:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    // Try the new method first
    if (typeof supabase.auth.getUser === 'function') {
      return await supabase.auth.getUser();
    }
    // Try getSession
    const session = await getSession();
    return { data: { user: session?.data?.session?.user } };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: any) => {
  try {
    // Try the new method first
    if (typeof supabase.auth.onAuthStateChange === 'function') {
      return supabase.auth.onAuthStateChange(callback);
    }
    // Fall back to the typed method
    return (supabase.auth as any).onAuthStateChange(callback);
  } catch (error) {
    console.error('Error in onAuthStateChange:', error);
    throw error;
  }
};
