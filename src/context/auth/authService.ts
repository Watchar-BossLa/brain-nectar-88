
import { supabase } from '@/lib/supabase';
import { Provider } from '@supabase/supabase-js';
import { 
  signInWithPassword, 
  signUp as supabaseSignUp,
  signInWithOAuth as supabaseSignInWithOAuth,
  signOut as supabaseSignOut
} from '@/lib/supabaseAuth';

/**
 * Signs in a user with email and password
 */
export const signIn = async (email: string, password: string) => {
  try {
    const { data, error } = await signInWithPassword(email, password);
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data,
      error: null
    };
  } catch (error: any) {
    console.error('Error signing in:', error);
    
    return {
      success: false,
      data: null,
      error: {
        message: error.message || 'Failed to sign in',
        code: error.code || 'unknown_error'
      }
    };
  }
};

/**
 * Signs in a user with a third-party provider
 */
export const signInWithOAuth = async (provider: Provider) => {
  try {
    const { data, error } = await supabaseSignInWithOAuth(provider, {
      redirectTo: `${window.location.origin}/auth/callback`
    });
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      data,
      error: null
    };
  } catch (error: any) {
    console.error('Error signing in with OAuth:', error);
    
    return {
      success: false,
      data: null,
      error: {
        message: error.message || 'Failed to sign in with OAuth',
        code: error.code || 'unknown_error'
      }
    };
  }
};

/**
 * Registers a new user with email and password
 */
export const signUp = async (email: string, password: string, metadata?: { [key: string]: any }) => {
  try {
    const { data, error } = await supabaseSignUp(email, password);
    
    if (error) {
      throw error;
    }
    
    // If user metadata was provided, update the user profile
    if (metadata && Object.keys(metadata).length > 0 && data?.user?.id) {
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: metadata.firstName || '',
          last_name: metadata.lastName || '',
          updated_at: new Date().toISOString()
        })
        .eq('id', data.user.id);
      
      if (updateError) {
        console.error('Error updating user profile:', updateError);
        // Don't throw here, as the user was created successfully
      }
    }
    
    return {
      success: true,
      data,
      error: null
    };
  } catch (error: any) {
    console.error('Error signing up:', error);
    
    return {
      success: false,
      data: null,
      error: {
        message: error.message || 'Failed to sign up',
        code: error.code || 'unknown_error'
      }
    };
  }
};

/**
 * Signs out the current user
 */
export const signOut = async () => {
  try {
    const { error } = await supabaseSignOut();
    
    if (error) {
      throw error;
    }
    
    return {
      success: true,
      error: null
    };
  } catch (error: any) {
    console.error('Error signing out:', error);
    
    return {
      success: false,
      error: {
        message: error.message || 'Failed to sign out',
        code: error.code || 'unknown_error'
      }
    };
  }
};

// Create a hook for accessing auth service functions
export const useAuthService = () => {
  return {
    signIn,
    signUp,
    signOut,
    signInWithOAuth
  };
};
