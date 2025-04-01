
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, name: string) => Promise<any>;
  signOut: () => Promise<void>;
  signInWithGoogle?: () => Promise<void>;
  isAdmin?: boolean;
}

// Define the platform owner as an object with name and email properties
export interface PlatformOwnerType {
  email: string;
  name: string;
}

export const PLATFORM_OWNER: PlatformOwnerType = {
  email: 'admin@studybee.com',
  name: 'Admin'
};
