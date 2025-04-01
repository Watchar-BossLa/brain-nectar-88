
import { User } from '@supabase/supabase-js';

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, name: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<void>; // Add missing method
  signOut: () => Promise<void>;
  isAdmin: boolean; // Add missing property
}
