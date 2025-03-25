
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export function useAuthService() {
  const { toast } = useToast();

  const signIn = async (email: string, password: string) => {
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
  };

  const signInWithGoogle = async () => {
    try {
      // Determine the correct redirect URL based on environment
      const redirectTo = window.location.hostname === 'localhost' 
        ? `${window.location.origin}`
        : 'https://www.studybee.info';
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
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
  };

  const signUp = async (email: string, password: string) => {
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
  };

  const signOut = async () => {
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
  };

  return {
    signIn,
    signUp,
    signInWithGoogle,
    signOut
  };
}
