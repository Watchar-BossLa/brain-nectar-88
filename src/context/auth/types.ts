
import { AuthSession as Session, User } from '@supabase/supabase-js';

export interface PlatformOwnerType {
  email: string;
  name: string;
}

export interface AuthContextType {
  session: Session | null;
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>;
  signInWithGoogle: () => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
  platformOwner: PlatformOwnerType;
  isAdmin: boolean;
}
