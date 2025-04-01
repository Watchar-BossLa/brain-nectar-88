import React, { useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { AuthContext } from './AuthContext';
import { supabase } from '@/lib/supabase';

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Add isAdmin state

  useEffect(() => {
    const session = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      setUser(session?.user || null);
      setLoading(false);
    };

    session();

    supabase.auth.onAuthStateChange(async (_event, session) => {
      setUser(session?.user || null);
      setLoading(false);

      // Check if user is admin on auth state change
      if (session?.user) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
          
        setIsAdmin(userData?.role === 'admin');
      } else {
        setIsAdmin(false);
      }
    });
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      
      // Check if user is admin
      if (data?.user) {
        const { data: userData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();
          
        setIsAdmin(userData?.role === 'admin');
      }
      
      return { error: null };
    } catch (err) {
      console.error('Error signing in:', err);
      return { error: err instanceof Error ? err : new Error('Unknown error occurred during sign in') };
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role: 'user', // Default role
          },
        },
      });
      if (error) throw error;
      return { error: null };
    } catch (err) {
      console.error('Error signing up:', err);
      return { error: err instanceof Error ? err : new Error('Unknown error occurred during sign up') };
    }
  };

  const signInWithGoogle = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`
        }
      });
    } catch (err) {
      console.error('Error signing in with Google:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAdmin(false);
    } catch (err) {
      console.error('Error signing out:', err);
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        error,
        signIn,
        signUp,
        signInWithGoogle,
        signOut,
        isAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
