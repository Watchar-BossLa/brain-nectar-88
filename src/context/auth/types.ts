
import { Session, User } from '@supabase/supabase-js';

// Platform owner information type
export type PlatformOwnerType = {
  name: string;
  email: string;
  phone: string;
  role: string;
};

// Auth context type
export type AuthContextType = {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  platformOwner: PlatformOwnerType;
  isAdmin: boolean;
};
