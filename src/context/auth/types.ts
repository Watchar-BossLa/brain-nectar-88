
// Import types from Supabase client
export interface AuthUser {
  id: string;
  email?: string;
  app_metadata: {
    provider?: string;
    [key: string]: any;
  };
  user_metadata: {
    avatar_url?: string;
    full_name?: string;
    [key: string]: any;
  };
  aud: string;
}

export interface PlatformOwnerType {
  email: string;
  [key: string]: string;
}

// Use any for Session since we don't need the specific type structure
export interface AuthContextType {
  session: any | null;
  user: AuthUser | null;
  loading: boolean;
  signIn: (email: string, password: string, callback?: (success: boolean) => void) => Promise<{ error: Error | null }>;
  signUp: (email: string, password: string, callback?: (success: boolean) => void) => Promise<{ error: Error | null }>;
  signInWithGoogle: (callback?: () => void) => Promise<{ error: Error | null }>;
  signOut: (callback?: () => void) => Promise<void>;
  platformOwner: {
    email: string;
    [key: string]: string;
  };
  isAdmin: boolean;
}
