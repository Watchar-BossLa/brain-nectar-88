import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PLATFORM_OWNER } from './constants';
import { AuthContext } from './AuthContext';
import { useAuthService } from './authService';

/**
 * Authentication provider component
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 * @returns {React.ReactElement} Auth provider component
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const authService = useAuthService();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email);
        setSession(session);
        setUser(session?.user ?? null);
        
        // Check if the current user is the platform administrator
        if (session?.user?.email === PLATFORM_OWNER.email) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
      }
    );

    // THEN check for existing session
    const initialSession = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error fetching session:', error);
          toast({
            title: 'Authentication Error',
            description: 'Failed to restore your session.',
            variant: 'destructive',
          });
          return;
        }
        
        if (data.session) {
          console.log('Initial session restored for:', data.session.user?.email);
          setSession(data.session);
          setUser(data.session.user);
          
          // Check if the current user is the platform administrator
          if (data.session.user.email === PLATFORM_OWNER.email) {
            setIsAdmin(true);
          }
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

  // Create wrapped versions of auth methods that handle navigation within components
  const wrappedAuthMethods = {
    signIn: authService.signIn,
    signUp: authService.signUp,
    signInWithGoogle: authService.signInWithGoogle,
    signOut: authService.signOut
  };

  return (
    <AuthContext.Provider 
      value={{
        session,
        user,
        loading,
        signIn: wrappedAuthMethods.signIn,
        signUp: wrappedAuthMethods.signUp,
        signInWithGoogle: wrappedAuthMethods.signInWithGoogle,
        signOut: wrappedAuthMethods.signOut,
        platformOwner: PLATFORM_OWNER,
        isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
