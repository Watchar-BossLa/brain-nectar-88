
import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthContextType, AuthUser, PlatformOwnerType } from './types';
import { useToast } from '@/components/ui/use-toast';
import { authService } from './authService';
import { 
  supabase, 
  getCurrentSession, 
  getCurrentUser, 
  signIn, 
  signUp, 
  signInWithGoogle, 
  signOut, 
  onAuthStateChange,
  Session,
  User
} from '@/lib/supabaseAuth';

// Create auth context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isPlatformOwner, setIsPlatformOwner] = useState(false);
  const { toast } = useToast();

  // Placeholder platform owner data
  const platformOwner: PlatformOwnerType = {
    name: 'Study Bee',
    email: 'admin@studybee.io'
  };
  
  const platformOwners: PlatformOwnerType[] = [
    { name: 'Study Bee Admin', email: 'admin@studybee.io' },
    { name: 'Support Team', email: 'support@studybee.io' }
  ];

  useEffect(() => {
    const loadSession = async () => {
      setLoading(true);
      try {
        // Get session data
        const { session: currentSession } = await getCurrentSession();
        
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user as AuthUser);
          
          // Check admin status
          const { data: adminData } = await supabase
            .from('admins')
            .select('*')
            .eq('user_id', currentSession.user.id)
            .single();
            
          setIsAdmin(!!adminData);
          setIsPlatformOwner(currentSession.user.email === platformOwner.email);
        } else {
          setSession(null);
          setUser(null);
          setIsAdmin(false);
          setIsPlatformOwner(false);
        }
      } catch (error) {
        console.error('Error loading session:', error);
      } finally {
        setLoading(false);
      }
    };

    loadSession();

    // Listen for auth changes
    const subscription = onAuthStateChange((event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user as AuthUser || null);
      setIsPlatformOwner(newSession?.user?.email === platformOwner.email);
      
      if (event === 'SIGNED_IN') {
        toast({
          title: 'Signed in',
          description: 'You have successfully signed in.'
        });
      }
      
      if (event === 'SIGNED_OUT') {
        toast({
          title: 'Signed out',
          description: 'You have been signed out.'
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, [toast, platformOwner.email]);

  // Auth methods
  const handleSignIn = async (email: string, password: string, callback?: (success: boolean) => void) => {
    const { error } = await signIn(email, password);
    
    if (error) {
      toast({
        title: 'Sign In Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
    
    if (callback) {
      callback(!error);
    }
    
    return { error };
  };

  const handleSignUp = async (email: string, password: string, callback?: (success: boolean) => void) => {
    const { error } = await signUp(email, password);
    
    if (error) {
      toast({
        title: 'Sign Up Failed',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      toast({
        title: 'Sign Up Successful',
        description: 'Check your email for the confirmation link.',
      });
    }
    
    if (callback) {
      callback(!error);
    }
    
    return { error };
  };

  const handleSignInWithGoogle = async (callback?: () => void) => {
    const { error } = await signInWithGoogle();
    
    if (error) {
      toast({
        title: 'Google Sign In Failed',
        description: error.message,
        variant: 'destructive'
      });
    }
    
    if (callback && !error) {
      callback();
    }
    
    return { error };
  };

  const handleSignOut = async (callback?: () => void) => {
    await signOut();
    
    setUser(null);
    setSession(null);
    setIsAdmin(false);
    setIsPlatformOwner(false);
    
    if (callback) {
      callback();
    }
  };

  const value = {
    session,
    user,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    signInWithGoogle: handleSignInWithGoogle,
    signOut: handleSignOut,
    platformOwner,
    platformOwners,
    isAdmin,
    isPlatformOwner
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
