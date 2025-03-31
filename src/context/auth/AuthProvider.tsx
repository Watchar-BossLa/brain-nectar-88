
import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PLATFORM_OWNERS } from './constants';
import { AuthContext } from './AuthContext';
import { useAuthService } from './authService';
import { AuthUser } from './types';
import type { Session } from '@supabase/supabase-js';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPlatformOwner, setIsPlatformOwner] = useState(false);
  const { toast } = useToast();
  const authService = useAuthService();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user as AuthUser ?? null);
        
        // Check if the current user is a platform administrator
        const userEmail = currentSession?.user?.email;
        
        if (userEmail) {
          // Check if user is a platform owner
          const isOwner = PLATFORM_OWNERS.some(owner => owner.email === userEmail);
          setIsPlatformOwner(isOwner);
          
          if (isOwner) {
            setIsAdmin(true);
          } else {
            // Check if the user is in the admins table
            if (currentSession?.user?.id) {
              checkIfUserIsAdmin(currentSession.user.id);
            }
          }
        } else {
          setIsAdmin(false);
          setIsPlatformOwner(false);
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
          setUser(data.session.user as AuthUser);
          
          // Check if the current user is a platform administrator
          const userEmail = data.session.user.email;
          
          if (userEmail) {
            // Check if user is a platform owner
            const isOwner = PLATFORM_OWNERS.some(owner => owner.email === userEmail);
            setIsPlatformOwner(isOwner);
            
            if (isOwner) {
              setIsAdmin(true);
            } else {
              // Check if the user is in the admins table
              if (data.session.user.id) {
                checkIfUserIsAdmin(data.session.user.id);
              }
            }
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

    // Check if a user is an admin by querying the admins table
    const checkIfUserIsAdmin = async (userId: string) => {
      try {
        const { data, error } = await supabase
          .from('admins')
          .select('*')
          .eq('user_id', userId);
          
        if (error) {
          console.error('Error checking admin status:', error);
          setIsAdmin(false);
          return;
        }
        
        setIsAdmin(data && data.length > 0);
      } catch (error) {
        console.error('Error checking admin status:', error);
        setIsAdmin(false);
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
        platformOwner: PLATFORM_OWNERS[0], // For backward compatibility
        platformOwners: PLATFORM_OWNERS,
        isAdmin,
        isPlatformOwner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
