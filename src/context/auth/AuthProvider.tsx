
import React, { createContext, useEffect, useState } from 'react';
import { AuthContextType, AuthUser } from './types';
import { supabase } from '@/integrations/supabase/client';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  // Listen for auth changes
  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user as AuthUser | null || null);
        setLoading(false);
      }
    );

    // Then check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user as AuthUser | null || null);
      setLoading(false);
    });

    // Cleanup subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Define auth methods
  const signIn = async (email: string, password: string, callback?: (success: boolean) => void) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (callback) callback(!error);
      return { error };
    } catch (error) {
      console.error("Sign in error:", error);
      if (callback) callback(false);
      return { error: error as Error };
    }
  };

  const signUp = async (email: string, password: string, callback?: (success: boolean) => void) => {
    try {
      const { error } = await supabase.auth.signUp({ email, password });
      if (callback) callback(!error);
      return { error };
    } catch (error) {
      console.error("Sign up error:", error);
      if (callback) callback(false);
      return { error: error as Error };
    }
  };

  const signInWithGoogle = async (callback?: () => void) => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (!error && callback) callback();
      return { error };
    } catch (error) {
      console.error("Google sign in error:", error);
      return { error: error as Error };
    }
  };

  const signOut = async (callback?: () => void) => {
    await supabase.auth.signOut();
    if (callback) callback();
  };

  // Platform owner info - hardcoded for simplicity
  const platformOwner = {
    email: 'admin@study-bee.com',
    name: 'Kelvin Administrator',
    role: 'admin'
  };

  // Check if current user is admin
  const isAdmin = user?.email === platformOwner.email;

  const value = {
    session,
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
    platformOwner,
    isAdmin
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
