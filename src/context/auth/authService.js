import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for authentication service
 * @returns {Object} Authentication methods
 * @returns {Function} returns.signIn - Sign in function
 * @returns {Function} returns.signUp - Sign up function
 * @returns {Function} returns.signInWithGoogle - Sign in with Google function
 * @returns {Function} returns.signOut - Sign out function
 */
export function useAuthService() {
  const { toast } = useToast();

  /**
   * Sign in with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Function} [callback] - Callback function after sign in
   * @returns {Promise<{error: Error|null}>} Result with error
   */
  const signIn = async (email, password, callback) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      
      if (error) {
        console.error('Sign in error:', error.message);
        toast({
          title: 'Sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        if (callback) callback(false);
        return { error };
      }
      
      if (data.session) {
        toast({
          title: 'Welcome back!',
          description: 'You have successfully signed in.',
        });
        
        // Use callback instead of direct navigation
        if (callback) callback(true);
        return { error: null };
      } else {
        toast({
          title: 'Sign in failed',
          description: 'No session was created.',
          variant: 'destructive',
        });
        if (callback) callback(false);
        return { error: new Error('No session created') };
      }
    } catch (error) {
      console.error('Unexpected sign in error:', error);
      toast({
        title: 'Sign in failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      if (callback) callback(false);
      return { error };
    }
  };

  /**
   * Sign in with Google
   * @param {Function} [callback] - Callback function after sign in
   * @returns {Promise<{error: Error|null}>} Result with error
   */
  const signInWithGoogle = async (callback) => {
    try {
      // Determine the correct redirect URL based on environment
      const redirectTo = window.location.hostname === 'localhost' 
        ? `${window.location.origin}`
        : `${window.location.origin}`;
      
      console.log('Google sign in with redirect to:', redirectTo);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo,
        }
      });
      
      if (error) {
        console.error('Google sign in error:', error.message);
        toast({
          title: 'Google sign in failed',
          description: error.message,
          variant: 'destructive',
        });
        return { error };
      }
      
      // Use callback if provided
      if (callback) callback();
      return { error: null };
    } catch (error) {
      console.error('Unexpected Google sign in error:', error);
      toast({
        title: 'Google sign in failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      return { error };
    }
  };

  /**
   * Sign up with email and password
   * @param {string} email - User email
   * @param {string} password - User password
   * @param {Function} [callback] - Callback function after sign up
   * @returns {Promise<{error: Error|null}>} Result with error
   */
  const signUp = async (email, password, callback) => {
    try {
      const { data, error } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          emailRedirectTo: window.location.origin
        }
      });
      
      if (error) {
        console.error('Sign up error:', error.message);
        toast({
          title: 'Sign up failed',
          description: error.message,
          variant: 'destructive',
        });
        if (callback) callback(false);
        return { error };
      }
      
      if (data.user) {
        toast({
          title: 'Welcome to Study Bee!',
          description: 'Your account has been created successfully. Please check your email for verification.',
        });
        
        // Use callback for navigation if session exists
        if (data.session && callback) {
          callback(true);
        }
        
        return { error: null };
      } else {
        toast({
          title: 'Sign up failed',
          description: 'No user was created.',
          variant: 'destructive',
        });
        if (callback) callback(false);
        return { error: new Error('No user created') };
      }
    } catch (error) {
      console.error('Unexpected sign up error:', error);
      toast({
        title: 'Sign up failed',
        description: 'An unexpected error occurred.',
        variant: 'destructive',
      });
      if (callback) callback(false);
      return { error };
    }
  };

  /**
   * Sign out
   * @param {Function} [callback] - Callback function after sign out
   * @returns {Promise<void>}
   */
  const signOut = async (callback) => {
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Sign out error:', error.message);
        toast({
          title: 'Sign out failed',
          description: error.message,
          variant: 'destructive',
        });
        return;
      }
      
      toast({
        title: 'Signed out',
        description: 'You have been successfully signed out.',
      });
      
      // Use callback for navigation
      if (callback) callback();
    } catch (error) {
      console.error('Unexpected sign out error:', error);
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
