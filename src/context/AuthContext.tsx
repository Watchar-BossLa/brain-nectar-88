import React, { useState, useEffect, createContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { PLATFORM_OWNER } from './auth/constants';
import { AuthUser } from './auth/types';
import { useAuthService } from './authService';

interface AuthContextProps {
  session: any | null;
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, options?: any) => Promise<any>;
  signInWithGoogle: () => Promise<any>;
  signOut: () => Promise<void>;
  platformOwner: any;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextProps>({
  session: null,
  user: null,
  loading: true,
  signIn: async () => ({}),
  signUp: async () => ({}),
  signInWithGoogle: async () => ({}),
  signOut: async () => {},
  platformOwner: PLATFORM_OWNER,
  isAdmin: false,
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<any | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const { toast } = useToast();
  const authService = useAuthService();

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('Auth state changed:', event, currentSession?.user?.email);
        setSession(currentSession);
        setUser(currentSession?.user as AuthUser ?? null);
        
        // Check if the current user is the platform administrator
        if (currentSession?.user?.email === PLATFORM_OWNER.email) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
        
        setLoading(false);
        
        // Handle case when a new user signs up - load default flashcards
        if (event === 'SIGNED_IN' || event === 'SIGNED_UP') {
          console.log('User signed in or signed up - loading default flashcards if needed');
          // Add code here to preload flashcards for new users
        }
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
};

export { AuthContext, AuthProvider };
export default AuthProvider;
