
import { Session } from '@supabase/supabase-js';

export interface AuthUser {
  id: string;
  email?: string;
  aud: string;
  role?: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    [key: string]: any;
  };
  created_at: string;
}

export type PlatformOwnerType = {
  email: string;
  name: string;
  role: string;
};

export interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string, callback?: (success: boolean) => void) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, callback?: (success: boolean) => void) => Promise<{ error: Error | null }>;
  signInWithGoogle: (callback?: () => void) => Promise<{ error: Error | null }>;
  signOut: (callback?: () => void) => Promise<void>;
  platformOwner: PlatformOwnerType;
  isAdmin: boolean;
}
