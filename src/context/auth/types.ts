
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
  isPlatformOwner: boolean;
  platformOwner: PlatformOwnerType;
  signIn: (email: string, password: string) => Promise<{
    success: boolean;
    data?: { user: User; session: Session } | any;
    error?: Error;
  }>;
  signInWithGoogle: () => Promise<{
    success: boolean;
    data?: any;
    error?: Error;
  }>;
  signUp: (
    email: string,
    password: string,
    metadata?: { [key: string]: any }
  ) => Promise<{
    success: boolean;
    data?: { user: User } | any;
    error?: Error;
  }>;
  signOut: () => Promise<{
    success: boolean;
    error?: Error;
  }>;
}

export type AuthUser = User;
