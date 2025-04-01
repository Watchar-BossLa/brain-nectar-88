
import React, { createContext, useState, useEffect } from 'react';
import { Session, User, WeakPassword } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { AuthContextType, PlatformOwnerType } from './types';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

const defaultPlatformOwner: PlatformOwnerType = {
  email: '',
  name: '',
  role: ''
};

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPlatformOwner, setIsPlatformOwner] = useState(false);
  const [platformOwner, setPlatformOwner] = useState<PlatformOwnerType>(defaultPlatformOwner);

  useEffect(() => {
    // Get the initial session
    async function getInitialSession() {
      setLoading(true);

      try {
        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          throw error;
        }

        if (session) {
          setSession(session);
          setUser(session.user);
          await checkUserRole(session.user);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
      } finally {
        setLoading(false);
      }
    }

    getInitialSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (session?.user) {
          await checkUserRole(session.user);
        } else {
          setIsAdmin(false);
          setIsPlatformOwner(false);
          setPlatformOwner(defaultPlatformOwner);
        }

        setLoading(false);
      }
    );

    // Clean up subscription
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const checkUserRole = async (user: User) => {
    try {
      // Check if user is admin
      const { data: adminData } = await supabase
        .from('admins')
        .select('*')
        .eq('user_id', user.id)
        .single();

      const isUserAdmin = !!adminData;
      setIsAdmin(isUserAdmin);

      // For demo purposes, let's check platform owner status
      // In a real app, this might be a separate table or auth claim
      const isPlatformOwnerEmail = user.email === 'demo@studybee.app';
      setIsPlatformOwner(isPlatformOwnerEmail);

      if (isPlatformOwnerEmail) {
        setPlatformOwner({
          email: user.email || '',
          name: 'Demo Platform Owner',
          role: 'owner'
        });
      } else {
        setPlatformOwner(defaultPlatformOwner);
      }
    } catch (error) {
      console.error('Error checking user role:', error);
      setIsAdmin(false);
      setIsPlatformOwner(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error signing in:', error);
      return {
        success: false,
        error: error as Error
      };
    }
  };

  const signInWithGoogle = async () => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error signing in with Google:', error);
      return {
        success: false,
        error: error as Error
      };
    }
  };

  const signUp = async (
    email: string, 
    password: string, 
    metadata?: { [key: string]: any }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata,
          emailRedirectTo: `${window.location.origin}/login`
        }
      });

      if (error) {
        throw error;
      }

      return {
        success: true,
        data
      };
    } catch (error) {
      console.error('Error signing up:', error);
      return {
        success: false,
        error: error as Error
      };
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      return { success: true };
    } catch (error) {
      console.error('Error signing out:', error);
      return {
        success: false,
        error: error as Error
      };
    }
  };

  const value: AuthContextType = {
    user,
    session,
    loading,
    isAdmin,
    isPlatformOwner,
    platformOwner,
    signIn,
    signInWithGoogle,
    signUp,
    signOut
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
