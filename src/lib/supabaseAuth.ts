
import { supabase } from './supabase';

// This file provides a compatibility layer for the Supabase API
// to handle different versions of the API

export type Provider = 'google' | 'github' | 'gitlab' | 'bitbucket' | 'twitter' | 'apple' | 'azure' | 'facebook' | 'discord' | 'twitch' | 'spotify';

// Updated to use v2 API signatures
export const signUp = async (email: string, password: string) => {
  try {
    return await supabase.auth.signUp({ 
      email, 
      password 
    });
  } catch (error) {
    console.error('Error in signUp:', error);
    throw error;
  }
};

export const signInWithPassword = async (email: string, password: string) => {
  try {
    return await supabase.auth.signInWithPassword({ 
      email, 
      password 
    });
  } catch (error) {
    console.error('Error in signInWithPassword:', error);
    throw error;
  }
};

export const signInWithOAuth = async (provider: Provider, options?: any) => {
  try {
    return await supabase.auth.signInWithOAuth({
      provider: provider as any,
      ...options
    });
  } catch (error) {
    console.error('Error in signInWithOAuth:', error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    return await supabase.auth.signOut();
  } catch (error) {
    console.error('Error in signOut:', error);
    throw error;
  }
};

export const getSession = async () => {
  try {
    return await supabase.auth.getSession();
  } catch (error) {
    console.error('Error in getSession:', error);
    throw error;
  }
};

export const getCurrentUser = async () => {
  try {
    return await supabase.auth.getUser();
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    throw error;
  }
};

export const onAuthStateChange = (callback: any) => {
  try {
    return supabase.auth.onAuthStateChange(callback);
  } catch (error) {
    console.error('Error in onAuthStateChange:', error);
    throw error;
  }
};
