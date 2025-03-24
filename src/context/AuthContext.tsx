import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initialSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        setSession(data.session);
        
        if (data.session?.user) {
          setUser(data.session.user);
        }
      } catch (error) {
        console.error('Error fetching session:', error);
        toast({
          title: 'Authentication Error',
          description: 'Failed to restore your session.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    initialSession();

    return () => {
      subscription.unsubscribe();
    };
  }, [toast]);

  const value = {
    session,
    user,
    loading,
    signIn: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          toast({
            title: 'Sign in failed',
            description: error.message,
            variant: 'destructive',
          });
          return { error };
        }
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        return { error: null };
      } catch (error) {
        toast({
          title: 'Sign in failed',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
        return { error: error as Error };
      }
    },
    signInWithGoogle: async () => {
      try {
        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: window.location.origin,
          }
        });
        
        if (error) {
          toast({
            title: 'Google sign in failed',
            description: error.message,
            variant: 'destructive',
          });
          return { error };
        }
        
        // No success toast here as the page will redirect to Google
        return { error: null };
      } catch (error) {
        toast({
          title: 'Google sign in failed',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
        return { error: error as Error };
      }
    },
    signUp: async (email: string, password: string) => {
      try {
        const { error } = await supabase.auth.signUp({ email, password });
        if (error) {
          toast({
            title: 'Sign up failed',
            description: error.message,
            variant: 'destructive',
          });
          return { error };
        }
        toast({
          title: 'Welcome to Study Bee!',
          description: 'Your account has been created successfully.',
        });
        return { error: null };
      } catch (error) {
        toast({
          title: 'Sign up failed',
          description: 'An unexpected error occurred.',
          variant: 'destructive',
        });
        return { error: error as Error };
      }
    },
    signOut: async () => {
      try {
        await supabase.auth.signOut();
        toast({
          title: 'Signed out',
          description: 'You have been successfully signed out.',
        });
      } catch (error) {
        console.error('Error signing out:', error);
        toast({
          title: 'Sign out failed',
          description: 'An error occurred while signing out.',
          variant: 'destructive',
        });
      }
    },
  };

  return <AuthContext.Provider value={session && user ? {
    session,
    user,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  } : {
    session: null,
    user: null,
    loading,
    signIn,
    signUp,
    signInWithGoogle,
    signOut,
  }}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
