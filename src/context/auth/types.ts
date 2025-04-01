
import { Session, User, WeakPassword } from '@supabase/supabase-js';

export type PlatformOwnerType = {
  email: string;
  name: string;
  role: string;
};

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isAdmin: boolean;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    data?: { user: User; session: Session; weakPassword?: WeakPassword };
    error?: any;
  }>;
  signInWithGoogle: () => Promise<{
    success: boolean;
    data?: any;
    error?: any;
  }>;
  signUp: (
    email: string,
    password: string,
    metadata?: { [key: string]: any }
  ) => Promise<{
    success: boolean;
    data?: { user: User | null; session: Session | null };
    error?: any;
  }>;
  signOut: () => Promise<{ success: boolean; error?: any }>;
}
